"""Compile static assets."""
from flask import Flask, current_app as app
from flask_assets import Bundle, Environment


def compile_static_assets(assets: Bundle) -> Bundle:
    """
    Create CSS stylesheet bundles from .less files.

    :param Bundle assets: Static asset bundle.

    :returns: Bundle
    """

    assets = Environment(app)
    assets.auto_build = True
    assets.debug = False
    common_style_bundle = Bundle(
        "src/less/style.less",
        filters="less,cssmin",
        output="dist/css/style.css",
        extra={"rel": "stylesheet/less"},
    )
    home_style_bundle = Bundle(
        "home_blueprint/less/home.less",
        filters="less,cssmin",
        output="dist/css/home.css",
        extra={"rel": "stylesheet/less"},
    )
    sec_helper_monster_selection_style_bundle = Bundle(
        "sec_helper_blueprint/less/monster-selection.less",
        filters="less,cssmin",
        output="dist/css/sec-helper-monster-selection.css",
        extra={"rel": "stylesheet/less"},
    )

    sec_helper_main_style_bundle = Bundle(
        "sec_helper_blueprint/less/main-page.less",
        filters="less,cssmin",
        output="dist/css/sec-helper-main-page.css",
        extra={"rel": "stylesheet/less"},
    )

    sec_helper_help_bundle = Bundle(
        "sec_helper_blueprint/less/help.less",
        filters="less,cssmin",
        output="dist/css/sec-helper-help.css",
        extra={"rel": "stylesheet/less"},
    )
    
    assets.register("common_style_bundle", common_style_bundle)
    assets.register("home_style_bundle", home_style_bundle)
    assets.register("sec_helper_monster_selection_style_bundle", sec_helper_monster_selection_style_bundle)
    assets.register("sec_helper_main_style_bundle", sec_helper_main_style_bundle)
    assets.register("sec_helper_help_bundle", sec_helper_help_bundle)

    if app.config["ENVIRONMENT"] == "development":
        common_style_bundle.build()
        home_style_bundle.build()
        sec_helper_monster_selection_style_bundle.build()
    return assets
