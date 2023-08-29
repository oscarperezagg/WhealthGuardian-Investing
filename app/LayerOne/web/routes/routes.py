

from flask import render_template


def indexRoutes(app):
    
    @app.route('/')
    def index():
        return render_template('index.html')