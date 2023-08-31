from flask import Blueprint, render_template, request, redirect
from flask_login import login_required

basicrouting = Blueprint('basicrouting', __name__)


@basicrouting.route('/')
@login_required
def index():
    return render_template('index.html')
