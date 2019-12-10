import pandas as pd
import glob

# load files
file_paths = sorted(glob.glob('data/Santa_Monica_2019-10-12*'))
files = []
for file_path in file_paths:
    files.append(pd.read_csv(file_path))

# initiate var
trip = pd.read_csv('data/trip.csv')
Recorder = files[0].copy()
Recorder['availability'] = 1
trip_count = -1

# loop through all the files
for i, file in enumerate(files):
    # compare each file with Recorder
    for index, x in Recorder.iterrows():
        if x['id'] in file['id'].values:
            if x['availability'] == 0:
                # log
                print('{} is back'.format(x['id']))

                # set availability back to 1
                Recorder.at[index, 'availability'] = 1

                # find corresponding trip, register a finish
                trip_id = trip.loc[trip['scooter_id'] == x['id'], 'trip_id']
                trip_id_int = trip_id.values.item(0)
                end_time = files[i].iloc[0]['timestamp']
                end_lat = files[i].loc[files[i]['id'] == x['id'], 'latitude']
                end_lat_float = end_lat.values.item(0)
                end_long = files[i].loc[files[i]['id'] == x['id'], 'longitude']
                end_long_float = end_long.values.item(0)
                end_location = (end_lat_float, end_long_float)
                trip.at[trip_id, 'end_time'] = end_time
                trip.at[trip_id, 'end_lat'] = end_lat_float
                trip.at[trip_id, 'end_long'] = end_long_float
            else:
                # log
                print('{} is not moved'.format(x['id']))
        else:
            if x['availability'] == 1:
                # log
                print('{} begins to travel'.format(x['id']))

                # set availability back to 0
                Recorder.at[index, 'availability'] = 0

                # register a new trip in trip file
                trip_count += 1
                start_time = files[i].iloc[0]['timestamp']
                start_lat = files[i - 1].loc[files[i - 1]['id'] == x['id'], 'latitude']
                start_lat_float = start_lat.values.item(0)
                start_long = files[i - 1].loc[files[i - 1]['id'] == x['id'], 'longitude']
                start_long_float = start_long.values.item(0)
                start_location = (start_lat_float, start_long_float)
                trip.at[trip_count, 'trip_id'] = trip_count
                trip.at[trip_count, 'scooter_id'] = x['id']
                trip.at[trip_count, 'start_time'] = start_time
                trip.at[trip_count, 'start_lat'] = start_lat_float
                trip.at[trip_count, 'start_long'] = start_long_float
            else:
                # log
                print('{} is still traveling'.format(x['id']))

path1 = 'data/Recorder.csv'
path2 = 'data/Santa_Monica_trip_2019-09-14.csv'

Recorder.to_csv(path1)
trip.to_csv(path2)
