import pandas as pd
import geopandas
from shapely.geometry import Point

# load and clean data in trip file
file_path = 'data/Santa_Monica_trip_2019-09-14.csv'
file = pd.read_csv(file_path)
file_cleaned = pd.DataFrame()
for index, x in file.iterrows():
    if pd.notnull(file.loc[index, 'end_time']):
        if file.loc[index, 'start_lat'] != file.loc[index, 'end_lat']:
            file_cleaned = file_cleaned.append(x, ignore_index=True)

file_cleaned = file_cleaned.loc[:, ~file_cleaned.columns.str.contains('^Unnamed')]

# convert dataframe to geodataframe
geometry_start = file_cleaned.apply(
    lambda row: Point(row['start_long'], row['start_lat']),
    axis='columns'
)
gdf_start = geopandas.GeoDataFrame()
gdf_start['scooter_id'] = file_cleaned['scooter_id']
gdf_start['start_time'] = file_cleaned['start_time']
gdf_start['geometry'] = geometry_start
print(gdf_start.head())

geometry_end = file_cleaned.apply(
    lambda row: Point(row['end_long'], row['end_lat']),
    axis='columns'
)
gdf_end = geopandas.GeoDataFrame()
gdf_end['scooter_id'] = file_cleaned['scooter_id']
gdf_end['end_time'] = file_cleaned['end_time']
gdf_end['geometry'] = geometry_end
print(gdf_end.head())

gdf_start.to_file('Visualizer/Santa_Monica_gdf_start.json', driver='GeoJSON')
gdf_end.to_file('Visualizer/Santa_Monica_gdf_end.json', driver='GeoJSON')

df = geopandas.read_file('Test/Skid_Row_Roads/Skid_Row_Roads.shp')
df.to_file('Visualizer/df.geojson', driver='GeoJSON')
print(df)
