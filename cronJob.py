# absolute file paths for executable python and executable script are needed

from crontab import CronTab

my_cron = CronTab(user='maitaoguo')
job = my_cron.new(
    command='/Users/maitaoguo/anaconda3/envs/ox/bin/python /Users/maitaoguo/Desktop/Code_Learning/Python_Learning/Data_Visualization/dataScraper.py')
job.minute.every(1)
my_cron.write()

'''
in order to remove cron job afterwards, enter 'crontab -r'
in terminal under specific virtual environment
'''
