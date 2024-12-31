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
        "src/less/*.less",
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
    monster_selection_style_bundle = Bundle(
        "sec_helper_blueprint/less/monster-selection.less",
        filters="less,cssmin",
        output="dist/css/monster-selection.css",
        extra={"rel": "stylesheet/less"},
    )
 
    main_output_style_bundle = Bundle(
        "sec_helper_blueprint/less/main-output.less",
        filters="less,cssmin",
        output="dist/css/main-output.css",
        extra={"rel": "stylesheet/less"},
    )

    assets.register("common_style_bundle", common_style_bundle)
    assets.register("home_style_bundle", home_style_bundle)
    assets.register("monster_selection_style_bundle", monster_selection_style_bundle)
    assets.register("main_output_style_bundle", main_output_style_bundle)

    if app.config["ENVIRONMENT"] == "development":
        common_style_bundle.build()
        home_style_bundle.build()
        monster_selection_style_bundle.build()
    return assets
