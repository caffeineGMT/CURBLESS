import pandas as pd

trip_column = ['trip_id',
               'start_time',
               'start_lat',
               'start_long',
               'end_time',
               'end_lat',
               'end_long',
               'scooter_id']
trip_df = pd.DataFrame(columns=trip_column)
path = 'data/trip.csv'
trip_df.to_csv(path)
