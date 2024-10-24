from importlib.resources import files
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from typing import TypedDict
from xblock.fields import Integer, Scope, String, List, Float, Dict

try:
    from xblock.utils.publish_event import PublishEventMixin  # pylint: disable=ungrouped-imports
    from xblock.utils.resources import ResourceLoader  # pylint: disable=ungrouped-imports
except ModuleNotFoundError:  # For backward compatibility with releases older than Quince.
    from xblockutils.publish_event import PublishEventMixin
    from xblockutils.resources import ResourceLoader

from xblock.utils.studio_editable import StudioEditableXBlockMixin
from xblock.scorable import ScorableXBlockMixin, Score


def _(text):
    """ Dummy `gettext` replacement to make string extraction tools scrape strings marked for translation """
    return text

class AreaType(TypedDict):
    id: str
    x: str
    y: str
    height: str
    width: str
    variant: str


class VariantType(TypedDict):
    id: str
    badgeChar: str
    badgeTitle: str
    text: str

@XBlock.needs('settings')
@XBlock.needs('i18n')
@XBlock.needs('user')
class OpenDNDXBlock(XBlock, StudioEditableXBlockMixin, ScorableXBlockMixin):
    # Настройки
    loader = ResourceLoader(__name__)

    display_name = String(
        display_name=_("Название блока"),
        scope=Scope.settings,
        default=_("Open DND XBlock"),
        enforce_type=True,
    )

    max_attempts = Integer(
        display_name=_("Максимум попыток"),
        scope=Scope.settings,
        default=None,
        enforce_type=True,
    )
    
    attempts = Integer(
        help=_("Количество использованных попыток"),
        scope=Scope.user_state,
        default=0,
        enforce_type=True,
    )

    weight = Float(
        display_name="Максимальное количество баллов",
        default=1.0,
        scope=Scope.settings,
        values={"min": 0},
    )

    score = Float(
        display_name="Rоличество баллов",
        default=0.0,
        scope=Scope.user_state,
        values={"min": 0},
    )

    has_score = True
    icon_class = 'problem'

    def has_submitted_answer(self):
        return True

    def max_score(self):
        return self.weight

    def get_score(self):
        return Score(raw_earned=self.score, raw_possible=self.weight)

    def set_score(self, score):
        self.score = score.raw_earned

    def calculate_score(self):
        return Score(raw_earned=self.score, raw_possible=self.weight)

    # Настройки задания

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
                width='25%',
                variant='header'
            ),
            AreaType(
                id='bottom-block',
                x='40%',
                y='5%',
                height='25%',
                width='25%',
                variant='footer'
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
            ),
            VariantType(
                id='footer',
                badgeChar='2',
                badgeTitle='Footer',
                text='Текст'
            ),
        ],
        enforce_type=True,
        values=VariantType
    )
    previous_answers = Dict(scope=Scope.user_state, default=None)
    previous_verdict = Dict(scope=Scope.user_state, default=None)

    editable_fields = ('title', 'description', 'imageUrl', 'max_attempts', 'weight', 'areas', 'variants')

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
    def checkTask(self, data, suffix=''):
        result = {
            "score": 0
        }

        self.previous_answers = data

        total_correct_answers= 0

        for key, value in data.items():
            if value is None:
                continue

            correct_value = None
            for area in self.areas:
                if area['id'] == key:
                    correct_value = area['variant']
                    break

            if correct_value is None:
                continue

            if correct_value == value:
                result[key] = True
                total_correct_answers += 1
            else:
                result[key] = False

        result['score'] = float(round(total_correct_answers / len(self.areas) * self.weight ))

        self.set_score(Score(raw_earned=result['score'], raw_possible=self.weight))
        self.rescore(only_if_higher=False)
        self.previous_verdict = result
        self.attempts += 1

        return result

    @XBlock.json_handler
    def getTask(self, data, suffix=''):
        return {
            "title": self.title,
            'description': self.description,
            "dropzone": {
                'imageUrl': self.imageUrl,
                'areas': self.areas
            },
            'variants': self.variants,
            'attempts': self.attempts,
            'max_attempts': self.max_attempts,
            'previous_answers': self.previous_answers,
            'previous_verdict': self.previous_verdict
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
