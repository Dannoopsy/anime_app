from django.db import models
from django.contrib.auth.models import User

class Anime(models.Model):
    ANIME_TYPES = [
        ("TV", "Сериал"),
        ("Movie", "Фильм"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    posters = models.ImageField(upload_to="posters/", blank=True, null=True)
    episodes = models.IntegerField(default=1)  
    release_date = models.DateField(blank=True, null=True)  
    anime_type = models.CharField(max_length=10, choices=ANIME_TYPES, default="TV") 

    def __str__(self):
        return self.title

class Review(models.Model):
    anime = models.ForeignKey(Anime, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()  
    text = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.anime.title} ({self.rating})'

    class Meta:
        unique_together = ('anime', 'user')

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username