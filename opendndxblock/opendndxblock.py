"""TO-DO: Write a description of what this XBlock is."""

from importlib.resources import files

from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, Scope
try:
    from xblock.utils.publish_event import PublishEventMixin  # pylint: disable=ungrouped-imports
    from xblock.utils.resources import ResourceLoader  # pylint: disable=ungrouped-imports
except ModuleNotFoundError:  # For backward compatibility with releases older than Quince.
    from xblockutils.publish_event import PublishEventMixin
    from xblockutils.resources import ResourceLoader


class OpenDNDXBlock(XBlock):
    loader = ResourceLoader(__name__)
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        return files(__package__).joinpath(path).read_text(encoding="utf-8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the OpenDNDXBlock, shown to students
        when viewing courses.
        """
        fragment = Fragment()
        fragment.add_content(self.loader.render_django_template("static/html/opendndxblock.html", context={
            "self": self,
            "script": self.resource_string("static/js/src/init.js")
        }))
        fragment.add_javascript(self.resource_string("static/js/src/init.js"))
        fragment.initialize_js('OpenDNDXBlock')
        return fragment

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("OpenDNDXBlock",
             """<opendndxblock/>
             """),
            ("Multiple OpenDNDXBlock",
             """<vertical_demo>
                <opendndxblock/>
                <opendndxblock/>
                <opendndxblock/>
                </vertical_demo>
             """),
        ]
