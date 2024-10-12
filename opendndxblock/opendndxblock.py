"""TO-DO: Write a description of what this XBlock is."""

from importlib.resources import files

from web_fragments.fragment import Fragment
from xblock.core import XBlock
from typing import TypedDict
from xblock.fields import Integer, Scope, String, List
try:
    from xblock.utils.publish_event import PublishEventMixin  # pylint: disable=ungrouped-imports
    from xblock.utils.resources import ResourceLoader  # pylint: disable=ungrouped-imports
except ModuleNotFoundError:  # For backward compatibility with releases older than Quince.
    from xblockutils.publish_event import PublishEventMixin
    from xblockutils.resources import ResourceLoader

from xblock.utils.studio_editable import StudioEditableXBlockMixin

class AreaType(TypedDict):
    id: str;
    x: str;
    y: str;
    height: str;
    width: str;

class VariantType(TypedDict):
    id: str;
    badgeChar: str;
    badgeTitle: str;
    text: str;


class OpenDNDXBlock(XBlock, StudioEditableXBlockMixin):
    loader = ResourceLoader(__name__)
    """
    TO-DO: document what your XBlock does.
    """

    title = String(display_name='Title', scope=Scope.content, default='Задание')
    description = String(display_name='Description', scope=Scope.content, default='Описание')
    imageUrl = String(display_name='Image URL', scope=Scope.content, default='https://placehold.co/1280x920')
    areas = List(
        display_name='Areas',
        scope=Scope.content,
        default=[
            AreaType(
                id='top-block',
                x='5%',
                y='5%',
                height='25%',
                width='25%'
            ),
            AreaType(
                id='bottom-block',
                x='40%',
                y='5%',
                height='25%',
                width='25%'
            ),
        ],
    )
    variants = List(
        display_name='Variants',
        scope=Scope.content, 
        default=[
            VariantType(
                id='header',
                badgeChar='1',
                badgeTitle='Header',
                text='Текст'
            )
        ],
        enforce_type=True, 
        values=VariantType
    )

    editable_fields = ('title', 'description', 'imageUrl')

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
            "script": self.resource_string("static/js/src/index.js"),
            "styles": self.resource_string("static/css/styles.css")
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
    
    @XBlock.json_handler
    def getTask(self, data, suffix=''):
        return {
            "title": self.title, 
            'description': self.description,
            "dropzone": {
                'imageUrl': self.imageUrl,
                'areas': self.areas
            },
            'variants': self.variants
            }

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
