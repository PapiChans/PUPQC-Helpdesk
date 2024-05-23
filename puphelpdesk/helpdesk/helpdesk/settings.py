"""
Django settings for helpdesk project.

Generated by 'django-admin startproject' using Django 4.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os, dj_database_url
# Cloudinary Storage
import cloudinary
import cloudinary.uploader
import cloudinary.api
import cloudinary_storage

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-9ergqbr6h18fh#%rufi8w=f2pzaw(&!rl36b#b6t*l=l2v*5#b'

# SECURITY WARNING: don't run with debug turned on in production!
# For Development set this DEBUG to True
DEBUG = True

ALLOWED_HOSTS = ['*','pupqc-helpdesk.onrender.com'] # For Deployment

# ALLOWED_HOSTS = [] # For Development

# Application definition

INSTALLED_APPS = [
    # Default / Built-in
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Applications
    'homepage',
    'student',
    'administrator',
    'api',
    # Plug-ins
    'rest_framework',
    'corsheaders',
    # Cloudinary Storage
    'cloudinary_storage',
    'cloudinary',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'helpdesk.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'helpdesk.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases


#DATABASES = {
#     'default': dj_database_url.config(
#         default='postgres://student_helpdesk_user:O6twebP7SoU6oOO80GXQzCRYeELDwWr5@dpg-cokv9qud3nmc739maa60-a.singapore-postgres.render.com/student_helpdesk',
#         )
#}

DATABASES = { # PostgreSQL Database
  'default': {
       'ENGINE': 'django.db.backends.postgresql',
       'NAME': 'Helpdesk',
       'USER': 'postgres',
       'PASSWORD': 'admin',
       'HOST': 'localhost',
       'PORT': '5432',
   }
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.ScryptPasswordHasher",
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root/')

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_REDIRECT_URL = "/"

LOGOUT_REDIRECT_URL = "/"

AUTH_USER_MODEL = "api.User"

#Email Sending Configuration
EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT=587
EMAIL_HOST_USER='procommandocfph@gmail.com'
EMAIL_HOST_PASSWORD='kbnazylfxxvzqier'
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
DEFAULT_FROM_EMAIL = 'PUPQC Student Helpdesk <no-reply@pupqchelpdesk.edu.ph>'

# Cloudinary Storage
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'drqa68vvu',
    'API_KEY': '352135633188664',
    'API_SECRET': 'svWeJv5SUmQIgDkGui2P9JF75DE'
}

# Set Cloudinary configuration
cloudinary.config(
    cloud_name='drqa68vvu',
    api_key='352135633188664',
    api_secret='svWeJv5SUmQIgDkGui2P9JF75DE',
    fetch_format='auto'  # Disable automatic transformations
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

CORS_ORIGIN_ALLOW_ALL = True

# CORS Middleware
CORS_ALLOWED_ORIGINS = [
    'https://student-performance-1.onrender.com',
    'http://localhost:8000',
    'https://pupqc-helpdesk.onrender.com',
    'http://127.0.0.1:8000',
]

CSRF_TRUSTED_ORIGINS = [
    'https://student-performance-1.onrender.com',
    'http://localhost:8000',
    'https://pupqc-helpdesk.onrender.com',
    'http://127.0.0.1:8000',
]

CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "x-api-key",
]