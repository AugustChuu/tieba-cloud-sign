from scheduler import task_sign


SQLALCHEMY_DATABASE_URI = ''
SECRET_KEY = ''
JOBS = [
    {
        'id': 'job_main',
        'func': task_sign,
        'args': None,
        'trigger': {
            'type': 'cron',
            'day_of_week': "0-6",
            'hour': '1',
            'minute': '0',
            'second': '0'
        }
    }
]