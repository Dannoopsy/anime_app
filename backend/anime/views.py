from django.shortcuts import render, get_object_or_404
from .models import Anime, Review
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics, status
from .serializers import AnimeSerializer, ReviewSerializer, RegisterSerializer, LoginSerializer, UserSerializer
from django.db.models import Avg, Count
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

def anime_list_back(request):
    animes = Anime.objects.all()
    return render(request, "anime_list.html", {"animes": animes})
    
def anime_detail(request, anime_id):
    anime = get_object_or_404(Anime, id=anime_id)
    reviews = anime.reviews.all()  # Получаем все отзывы для аниме
    return render(request, "anime_detail.html", {"anime": anime, "reviews": reviews})

def user_reviews(request, user_id):
    user = get_object_or_404(User, id=user_id)
    reviews = user.reviews.all()
    return render(request, "user_reviews.html", {"user": user, "reviews": reviews})



class AnimeReviewsListView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        anime_id = self.kwargs["anime_id"]
        return Review.objects.filter(anime_id=anime_id)

    def perform_create(self, serializer):
        anime = get_object_or_404(Anime, id=self.kwargs["anime_id"])
        serializer.save(anime=anime)

class AnimeDetailView(APIView):
    def get(self, request, pk):
        try:
            anime = Anime.objects.get(pk=pk)
        except Anime.DoesNotExist:
            return Response({"error": "Аниме не найдено"}, status=404)

        anime_data = AnimeSerializer(anime).data
        
        avg_rating = Review.objects.filter(anime=anime).aggregate(Avg("rating"))["rating__avg"] or 0
        
        rating_counts = (
            Review.objects.filter(anime=anime)
            .values("rating")
            .annotate(count=Count("rating"))
            .order_by("rating")
        )

        histogram = {i: 0 for i in range(1, 11)}
        for item in rating_counts:
            histogram[item["rating"]] = item["count"]

        anime_data["avg_rating"] = round(avg_rating, 1)
        anime_data["rating_histogram"] = histogram
        anime_data["reviews_count"] = Review.objects.filter(anime=anime).count()

        return Response(anime_data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Регистрация успешна"}, status=status.HTTP_201_CREATED)

        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser) 

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, username):
        if request.user.username != username:
            return Response({"error": "Вы можете редактировать только свой профиль."}, status=403)

        user = request.user
        data = {"profile": {}}  

        if "avatar" in request.FILES:
            data["profile"]["avatar"] = request.FILES["avatar"]

        if "bio" in request.data:
            data["profile"]["bio"] = request.data["bio"]

        serializer = UserSerializer(user, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class AddReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, anime_id):
        anime = get_object_or_404(Anime, id=anime_id)
        existing_review = Review.objects.filter(anime=anime, user=request.user).first()
        
        if existing_review:
            return Response({"error": "Вы уже оставили отзыв на это аниме"}, status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        data["anime"] = anime_id
        data["user"] = request.user.id

        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user, anime=anime)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
def anime_list(request):
    animes = Anime.objects.all()
    serializer = AnimeSerializer(animes, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def anime_detail_api(request, pk):
    anime = get_object_or_404(Anime, pk=pk)
    serializer = AnimeSerializer(anime)
    return Response(serializer.data)

@api_view(["GET"])
def anime_review_api(request, pk):
    review = get_object_or_404(Review, pk=pk)
    serializer = ReviewSerializer(review)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])  
def add_review(request, anime_id):
    try:
        anime = Anime.objects.get(id=anime_id)
    except Anime.DoesNotExist:
        return Response({"error": "Аниме не найдено"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data["anime"] = anime_id
    data["user"] = request.user.id

    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user, anime=anime)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

