"""General page routes."""
from flask import Blueprint
from flask import render_template, redirect, url_for

# Blueprint Configuration
home_blueprint = Blueprint("home_blueprint", __name__, template_folder="templates", static_folder="static")


@home_blueprint.route("/", methods=["GET"])
def home() -> str:
    """
    Serve `Home` page template.

    :returns: str
    """
    products = []
    return redirect(url_for('sec_helper_blueprint.sec_helper'))


@home_blueprint.route("/about", methods=["GET"])
def about() -> str:
    """
    Serve `About` page template.

    :returns: str
    """
    return render_template(
        "index.jinja2",
        title="About",
        subtitle="",
        template="home-template page",
    )


@home_blueprint.route("/contact", methods=["GET"])
def contact() -> str:
    """
    Serve `Contact` page template.

    :returns: str
    """
    return render_template(
        "index.jinja2",
        title="Contact",
        subtitle="",
        template="home-template page",
    )
