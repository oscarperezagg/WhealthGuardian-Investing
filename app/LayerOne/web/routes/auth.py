
from flask import render_template


def authenticationRoutes(app):
    

    @app.route('/login')
    def auth():
        return render_template('Auth/login.html')