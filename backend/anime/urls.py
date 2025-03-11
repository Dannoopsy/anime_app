from django.urls import path
from .views import anime_list_back, anime_detail, user_reviews, add_review, anime_list, anime_detail_api, AnimeReviewsListView, AnimeDetailView, RegisterView, LoginView, UserDetailView, UserProfileView, AddReviewView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("", anime_list_back, name="anime_list"),
    path("anime/<int:anime_id>/", anime_detail, name="anime_detail"),
    path("anime/<int:anime_id>/add_review/", AddReviewView.as_view(), name="add_review"),
    path("user/<int:user_id>/reviews/", user_reviews, name="user_reviews"),
    path("api/anime/", anime_list, name="anime-list"),
    path("api/anime/<int:pk>/", AnimeDetailView.as_view(), name="anime-detail"),
    path('api/anime/<int:anime_id>/reviews/', AnimeReviewsListView.as_view(), name='anime-reviews'),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/user/", UserDetailView.as_view(), name="user_detail"),
    path("api/anime/<int:anime_id>/add_review/", AddReviewView.as_view(), name="add_review"),
    path("api/users/<str:username>/", UserProfileView.as_view(), name="user_profile"),

]
