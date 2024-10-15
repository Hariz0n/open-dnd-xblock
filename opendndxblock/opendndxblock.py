from importlib.resources import files
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from typing import TypedDict
from xblock.fields import Integer, Scope, String, List, Float, Dict, Boolean
from .utils import _

try:
    from xblock.utils.publish_event import PublishEventMixin  # pylint: disable=ungrouped-imports
    from xblock.utils.resources import ResourceLoader  # pylint: disable=ungrouped-imports
except ModuleNotFoundError:  # For backward compatibility with releases older than Quince.
    from xblockutils.publish_event import PublishEventMixin
    from xblockutils.resources import ResourceLoader

from xblock.utils.studio_editable import StudioEditableXBlockMixin
from xblock.scorable import ScorableXBlockMixin, Score


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


class OpenDNDXBlock(XBlock, StudioEditableXBlockMixin, ScorableXBlockMixin):
    # Настройки
    loader = ResourceLoader(__name__)

    display_name = String(
        display_name=_("Название блока"),
        scope=Scope.settings,
        default=_("Drag and Drop"),
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
        display_name=_("Количество баллов"),
        help=_("Defines the number of points the problem is worth."),
        scope=Scope.settings,
        default=1,
        enforce_type=True,
    )

    completed = Boolean(
        help=_("Индикатор было ли задание отвечено хоть раз"),
        scope=Scope.user_state,
        default=False,
        enforce_type=True,
    )

    raw_earned = Float(
        help=_("Keeps maximum score achieved by student as a raw value between 0 and 1."),
        scope=Scope.user_state,
        default=0,
        enforce_type=True,
    )

    raw_possible = Float(
        help=_("Maximum score available of the problem as a raw value between 0 and 1."),
        scope=Scope.user_state,
        default=1,
        enforce_type=True,
    )

    icon_class = 'problem'

    @property
    def score(self):
        return Score(self.raw_earned, self.raw_possible)
    
    def max_score(self):
        return 1
    
    def get_score(self):
        if self._get_raw_earned_if_set() is None:
            self.raw_earned = self._learner_raw_score()
        return Score(self.raw_earned, self.raw_possible)
    
    def set_score(self, score):
        self.raw_earned = score.raw_earned
        self.raw_possible = score.raw_possible

    def calculate_score(self):
        return Score(self._learner_raw_score(), self.max_score())
    
    def has_submitted_answer(self):
        return self.fields['raw_earned'].is_set_on(self)
    
    def weighted_grade(self):
        if self.raw_possible <= 0:
            return None

        if self.weight is None:
            return self.raw_earned

        weighted_earned = self.raw_earned * self.weight / self.raw_possible
        return weighted_earned
    
    def publish_grade(self, score=None, only_if_higher=None):
        if not score:
            score = self.score

        self._publish_grade(score, only_if_higher)
        return {'grade': self.score.raw_earned, 'max_grade': self.score.raw_possible}
    
    def _learner_raw_score(self):
        """
        Calculate raw score for learner submission.

        As it is calculated as ratio of correctly placed (or left in bank in case of decoys) items to
        total number of items, it lays in interval [0..1]
        """
        correct_count, total_count = self._get_item_stats()
        return correct_count / float(total_count)

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

    editable_fields = ('display_name', 'title', 'description', 'imageUrl', 'max_attempts', 'weight')

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

        result['score'] = total_correct_answers / len(self.areas)
        self.set_score(Score(total_correct_answers / len(self.areas), self.max_score()))
        self.publish_grade()

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
            'previous_answers': self.previous_answers
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
