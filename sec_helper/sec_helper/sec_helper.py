"""page routes for sec_helper"""

from flask import Blueprint,current_app, request, send_from_directory
from flask import render_template, session, redirect, url_for

from webargs import fields, validate
from webargs.flaskparser import abort, parser

from flask_sitemapper import Sitemapper



### enable import sub modules in current directory
# pylint: disable=C0411
import os
import sys
import inspect

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, current_dir)
### end


# pylint: disable=C0413
from model.simultaneous_equation_cannons_state import SimultaneousEquationCannonsState
from model.form_input_monsters import parse_monster_level

sec_helper_blueprint = Blueprint("sec_helper_blueprint", __name__, template_folder="templates", static_folder="static")
### sitemap
sitemapper = Sitemapper()


validators_args = {
    "xyz-selection": fields.List(fields.Str(), validate =[validate.Length(min=0,max=12) ]),
    "fusion-selection": fields.List(fields.Str(), validate =[validate.Length(min=0,max=12) ]),
    "button-save":fields.Str()
}

@sitemapper.include(
    lastmod = "2025-01-03",
    changefreq = "monthly",
    priority = 1.0,
)
@sec_helper_blueprint.route("/", methods=["GET"])
def sec_helper() -> str:
    """
    display main data table and show solutions
    """
    defaults_session = {'extra-deck-xyz':[2,3,4,5,6], 'extra-deck-fusion': [2,3,4,5,6],
                        'banished-xyz':[], 'banished-fusion': [] }
    session_vars = _get_session_variables(defaults_session)

    sec = None
    error = None
    if len(session_vars['extra-deck-fusion']) + len(session_vars['extra-deck-xyz']) * 2 <= 15:
        sec = SimultaneousEquationCannonsState(session_vars['extra-deck-fusion'],session_vars['extra-deck-xyz'],
                                           session_vars['banished-fusion'], session_vars['banished-xyz'])
    else:
        sec = SimultaneousEquationCannonsState(defaults_session['extra-deck-fusion'],defaults_session['extra-deck-xyz'],
                                           session_vars['banished-fusion'], session_vars['banished-xyz'])
        session['extra-deck-xyz'] = list(map(str,defaults_session['extra-deck-xyz']))
        session['extra-deck-fusion'] = list(map(str,defaults_session['extra-deck-fusion']))
        error = "over15"

    color_range = sec.find_color_range()
    session.permanent = True
    return render_template(
        "sec_helper.jinja2",
        title="YGO SEC Helper",
        subtitle="༼ つ ◕_◕ ༽つ",
        template="sec-helper-template",
        value_table=sec.value_table,
        error=error,
        color_range=color_range,
    )

def _get_session_variables(session_variables: dict):
    """
    get session variables. if they don't exist, set default one
    """
    res = dict()
    for key in session_variables.keys():
        if session.get(key) is not None:
            res[key] = parse_monster_level(session[key])
        else:
            res[key] = session_variables[key] #set to default 
    return res


@sitemapper.include(
    lastmod = "2025-01-03",
    changefreq = "monthly",
    priority = 1.0,
)
@sec_helper_blueprint.route("/extra_deck", methods=["GET"])
def extra_deck() -> str:
    """
    get extra deck monster page
    """

    defaults_session = {'extra-deck-xyz':[2,3,4,5,6], 'extra-deck-fusion': [2,3,4,5,6] }
    session_vars = _get_session_variables(defaults_session)
    return render_template(
        "monster_selection.jinja2",
        title="Define Extra Deck Monsters",
        subtitle="to Banish",
        template="sec-helper-template",
        selected_xyz = session_vars['extra-deck-xyz'],
        selected_fusion = session_vars['extra-deck-fusion']
    )

@sec_helper_blueprint.route("/extra_deck", methods=["POST"])
@parser.use_args(validators_args, location="form")
def extra_deck_post(args) -> str:
    """
    set extra deck monsters in session
    """
    selected_xyz = []
    selected_fusion = []
    if 'xyz-selection' in args:
        selected_xyz = args['xyz-selection']
    if 'fusion-selection' in args:
        selected_fusion = args['fusion-selection']
    
    selected_xyz_integer = parse_monster_level(selected_xyz)
    selected_fusion_integer = parse_monster_level(selected_fusion)

    session['extra-deck-xyz'] = list(map(str,selected_xyz_integer))
    session['extra-deck-fusion'] = list(map(str,selected_fusion_integer))

    return redirect(url_for('sec_helper_blueprint.sec_helper'))


@sitemapper.include(
    lastmod = "2025-01-03",
    changefreq = "monthly",
    priority = 1.0,
)
@sec_helper_blueprint.route("/banished", methods=["GET"])
def banished_monsters() :
    """
    get banish monster page
    """

    defaults_session = {'banished-xyz':[], 'banished-fusion': [] }
    session_vars = _get_session_variables(defaults_session)
    
    return render_template(
        "monster_selection.jinja2",
        title="Define Previously Banished Monsters",
        subtitle="for More SEC",
        template="sec-helper-template",
        selected_xyz = session_vars['banished-xyz'],
        selected_fusion = session_vars['banished-fusion']
    )

@sec_helper_blueprint.route("/banished", methods=["POST"])
@parser.use_args(validators_args, location="form")
def banished_monsters_post(args) -> str:
    """
    set banished monsters in session
    """
    selected_xyz = []
    selected_fusion = []
    if 'xyz-selection' in args:
        selected_xyz = args['xyz-selection']
    if 'fusion-selection' in args:
        selected_fusion = args['fusion-selection']

    selected_xyz_integer = []
    selected_fusion_integer =[]
    if 'button-save' in args and args['button-save'] != 'reset':
        selected_xyz_integer = parse_monster_level(selected_xyz)
        selected_fusion_integer = parse_monster_level(selected_fusion)

    session['banished-xyz'] = list(map(str,selected_xyz_integer))
    session['banished-fusion'] = list(map(str,selected_fusion_integer))

    return redirect(url_for('sec_helper_blueprint.sec_helper'))


# This error handler is necessary for usage with Flask-RESTful
@parser.error_handler
# pylint: disable=W0613
def handle_request_parsing_error(err, req, schema, *, error_status_code, error_headers):
    """webargs error handler that uses Flask-RESTful's abort function to return
    a JSON error response to the client.
    """
    abort(error_status_code, errors=err.messages)

@sitemapper.include(
    lastmod = "2025-01-03",
    changefreq = "monthly",
    priority = 1.0,
)
@sec_helper_blueprint.route("/help", methods=["GET"])
def sec_help() -> str:
    """
    show help page
    """
    
    return render_template(
        "sec_helper_help.jinja2",
        title="Tutorials",
        subtitle="",
        template="sec-helper-template",
    )

@sec_helper_blueprint.route("/sec_helper.js", methods=["GET"])
def sec_help_js() -> str:
    """
    show js help page
    """
    return send_from_directory(os.path.join(current_app.static_folder,"dist","js"), "sec_helper.js")

@current_app.route("/sitemap.xml")
def r_sitemap():
    return sitemapper.generate()

@current_app.route("/robots.txt")
def r_robots():
    
    return  send_from_directory(current_app.static_folder, "robots.txt" )
    