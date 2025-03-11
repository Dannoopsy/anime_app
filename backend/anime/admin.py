from django.contrib import admin
from .models import Anime, Review, Profile
from django.contrib.auth.models import User

admin.site.register(Anime)
admin.site.register(Review)

class ProfileInline(admin.StackedInline):  
    model = Profile
    can_delete = False
    extra = 0  

class UserAdmin(admin.ModelAdmin):
    inlines = [ProfileInline]

admin.site.unregister(User)
admin.site.register(User, UserAdmin)