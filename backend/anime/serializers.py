from rest_framework import serializers
from .models import Anime, Review, Profile
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Review
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar", "bio"]


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    avatar = serializers.ImageField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'avatar', 'bio']

    def validate(self, data):
        errors = {}

        if data['password'] != data['password2']:
            errors["password"] = "Пароли не совпадают."
        if User.objects.filter(email=data['email']).exists():
            errors["email"] = "Этот email уже используется."
        if User.objects.filter(username=data['username']).exists():
            errors["username"] = "Имя пользователя уже занято."
        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        validated_data.pop('password2') 
        avatar = validated_data.pop('avatar', None)
        bio = validated_data.pop('bio', "")
    
        user = User.objects.create_user(**validated_data)
        profile, created = Profile.objects.get_or_create(user=user, defaults={"avatar": avatar, "bio": bio})
        # if not created:
        profile.avatar = avatar if avatar else profile.avatar
        profile.bio = bio
        profile.save()
    
        return user


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    rated_anime = serializers.SerializerMethodField()
    rating_histogram = serializers.SerializerMethodField() 
    average_score = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "profile", "rated_anime", "rating_histogram", "average_score", "review_count"]

    def get_profile(self, obj):
        profile = Profile.objects.get(user=obj)
        return {
            "avatar": profile.avatar.url if profile.avatar else None,
            "bio": profile.bio
        }

    def get_rated_anime(self, obj):
        ratings = Review.objects.filter(user=obj).select_related("anime")
        return [
            {
                "id": rating.anime.id,
                "title": rating.anime.title,
                "posters": rating.anime.posters.url if rating.anime.posters else None,
                "user_score": rating.rating,
            }
            for rating in ratings
        ]

    def get_rating_histogram(self, obj):
        ratings = Review.objects.filter(user=obj).values_list("rating", flat=True)
        histogram = {i: 0 for i in range(1, 11)}  
        for score in ratings:
            histogram[score] += 1
        return histogram

    def get_average_score(self, obj):
        ratings = Review.objects.filter(user=obj).values_list("rating", flat=True)
        return round(sum(ratings) / len(ratings), 2) if ratings else 0.0

    def get_review_count(self, obj):
        ratings = Review.objects.filter(user=obj).values_list("rating", flat=True)
        return len(ratings) if ratings else 0.0
        
    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)  
        profile = instance.profile 

        if profile_data:
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save() 

        return instance





class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "Пользователь не найден"})

        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Неверный пароль"})

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
        }

