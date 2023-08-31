from flask import Blueprint, render_template, redirect, request, url_for,session
from src.models import db, User
from flask_login import login_user,login_required,logout_user

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        print("AQUI")
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        # check if the user actually exists
        # take the user-supplied password, hash it, and compare it to the hashed password in the database
        if not user or not user.check_password(password):
            return redirect(url_for('auth.login')) # if the user doesn't exist or password is wrong, reload the page
        else:
            login_user(user)
            return redirect(url_for('basicrouting.index'))
    # if the above check passes, then we know the user has the right credentials
            
    return render_template('Auth/login.html')

@auth.route('/newuser', methods=['GET', 'POST'])
@login_required
def newuser():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('auth.login'))
    return render_template('Auth/newuser.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
