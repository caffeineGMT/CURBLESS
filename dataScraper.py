import requests
import uuid
import json
import pandas as pd
import datetime
from numpy import arange


# utility functions

# get token from bird api
def get_auth_token(guid):
    url = 'https://api.birdapp.com/user/login'
    headers = {
        'User-Agent': 'Bird/4.41.0 (co.bird.Ride; build:37; iOS 12.3.1) Alamofire/4.41.0',
        'Device-id': guid,
        'Platform': 'ios',
        'App-Version': '4.41.0',
        'Content-Type': 'application/json',
    }
    payload = {
        'email': '{}@example.com'.format(guid)
    }
    r = requests.post(url=url, data=json.dumps(payload), headers=headers)
    token = r.json().get('token')
    return token


# get nearby scooters use the token above
def get_nearby_scooters(token, lat, long):
    url = 'https://api.birdapp.com/bird/nearby'
    params = {
        'latitude': lat,
        'longitude': long,
        'radius': 1000
    }
    headers = {
        'Authorization': 'Bird {}'.format(token),
        'Device-id': '{}'.format(guid),
        'App-Version': '4.41.0',
        'Location': json.dumps({
            'latitude': lat,
            'longitude': long,
            'altitude': 500,
            'accuracy': 100,
            'speed': -1,
            'heading': -1
        })
    }
    r = requests.get(url=url, params=params, headers=headers)

    scooters = r.json().get('birds')

    return scooters


# split location dictionary into latitude and longitude
def split_location(df, location_label='location'):
    locs = df[location_label].apply(pd.Series)
    df_new = pd.concat([df, locs], axis=1)
    df_new = df_new.drop(location_label, axis=1)
    return df_new


# create search grid using given location as grid center
def grid(lat, long):
    # need to add a really small number to make the upper limit being included in the arrange function
    delta = 0.0001
    lat_stepsize = 0.005
    long_stepsize = 0.01
    latmin = lat - 1 * lat_stepsize
    latmax = lat + 1 * lat_stepsize + delta
    longmin = long - 1 * long_stepsize
    longmax = long + 1 * long_stepsize + delta
    locs = []
    for x in arange(latmin, latmax, lat_stepsize):
        for y in arange(longmin, longmax, long_stepsize):
            locs.append((x, y))
    return locs


# get nearby scooters based on grid
def get_nearby_scooters_by_grid(token, lat, long):
    scooters = pd.DataFrame()
    locs = grid(lat, long)
    for loc in locs:
        scooters_json = get_nearby_scooters(token, loc[0], loc[1])
        scooters_df = pd.DataFrame(scooters_json)
        scooters = scooters.append(scooters_df, ignore_index=True)
    scooters.drop_duplicates(subset='id', inplace=True)
    return scooters


# token extract
guid = str(uuid.uuid1())
token = get_auth_token(guid)
assert token is not None

# store city info
cities = [{'name': 'Mel_Rose', 'location': (34.0837, -118.3550)},
          {'name': 'DTLA', 'location': (34.0407, -118.2468)},
          {'name': 'Santa_Monica', 'location': (34.0195, -118.4912)}]
cities_df = pd.DataFrame(cities)

# extract scooters info for each city
for index, city in cities_df.iterrows():
    lat = city['location'][0]
    long = city['location'][1]
    birds_df = get_nearby_scooters_by_grid(token, lat, long)
    birds_df = split_location(birds_df)
    birds_df['timestamp'] = datetime.datetime.now()
    path = '/Users/maitaoguo/Desktop/Code_Learning/Python_Learning/Data_Visualization/data/{}_{}.csv'.format(
        city['name'], datetime.datetime.now().strftime('%Y-%m-%d_%H-%M'))
    birds_df.to_csv(path)
