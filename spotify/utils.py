from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credential import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

BASE_URL = 'https://api.spotify.com/v1/me/'

def _get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_key, access_token, token_type, expires_in, refresh_token):
    token = _get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    if token:
        token.access_token = access_token
        token.token_type = token_type
        token.refresh_token = refresh_token
        token.expires_in = expires_in
        token.save(update_fields=['access_token', 'token_type', 'expires_in', 'refresh_token'])
    else:
        token = SpotifyToken(user=session_key,
        access_token=access_token,
        token_type=token_type,
        expires_in=expires_in,
        refresh_token=refresh_token)
        token.save()

def is_spotify_authenticated(session_key):
    tokens = _get_user_tokens(session_key)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            print('debug: token expired!')
            refresh_spotify_token(session_key)
        else:
            print('debug: token not expired')
        return True
    return False

def refresh_spotify_token(session_key):
    token = _get_user_tokens(session_key)
    refresh_token = token.refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()
    print('debug: response of refresh:\n')
    print(response)
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    if not refresh_token:
        refresh_token = token.refresh_token

    update_or_create_user_tokens(session_key,
        access_token,
        token_type,
        expires_in,
        refresh_token)

def execute_spotify_api_request(session_key, endpoint, method='get'):
    tokens = _get_user_tokens(session_key)
    headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokens.access_token}

    if method == 'post':
        response = post(BASE_URL + endpoint, headers=headers)
        return response

    if method == 'put':
        response = put(BASE_URL + endpoint, headers=headers)
        return response
    
    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}

def play_song(session_key):
    print('debug: play_song()')
    return execute_spotify_api_request(session_key, 'player/play/', method='put')

def pause_song(session_key):
    return execute_spotify_api_request(session_key, 'player/pause/', method='put')

def skip_song(session_key):
    return execute_spotify_api_request(session_key, 'player/next/', method='post')