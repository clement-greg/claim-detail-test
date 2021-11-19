import { DatePipe } from '@angular/common';
import { Component, Input, ViewContainerRef, Output, EventEmitter, SimpleChanges, OnChanges, OnInit } from '@angular/core';



import { DomSanitizer } from '@angular/platform-browser';
import { Answer, Question, QuestionParserService } from '../question-parser.service';
import { UtilitiesService } from '../utilities';

export class KeyValuePair {
  key: string;
  value: any;
}

export class QuestionnaireEnvironmentalVariables {

  sessionVariables: any = {};
  questions: Question[];
  objectInScope: any;
  objectTags: any[];
  userType: string;
  forecast: any[];
  brand: any;

  hasTag(tagNameOrId: string): string {

    if (!this.objectTags) {
      return 'False';
    }

    const objectTag = this.objectTags.find(i => i.id === tagNameOrId || i.name === tagNameOrId);
    if (objectTag) {
      return 'True';
    }

    return 'False';
  }

  getSessionVariable(key: string) {
    return this.sessionVariables[key];
  }

  doesNotHaveTag(tagNameOrId: string) {
    return this.hasTag(tagNameOrId) === 'True' ? 'False' : 'True';
  }

  getMonthNumber() {
    return (new Date().getMonth() + 1).toString();
  }

  getMonthName() {
    const datePipe = new DatePipe('en-US');

    return datePipe.transform(new Date(), 'MMMM');
  }

  getMaxForecastedHigh() {
    if (!this.forecast) {
      return;
    }

    return Math.max(...this.forecast.map(i => i.high));
  }

  getMinForecastedHigh() {
    if (!this.forecast) {
      return;
    }

    return Math.min(...this.forecast.map(i => i.high));
  }

  getMinForecastedLow() {
    if (!this.forecast) {
      return;
    }

    return Math.min(...this.forecast.map(i => i.low));
  }

  getMaxForecastedLow() {
    if (!this.forecast) {
      return;
    }
    return Math.max(...this.forecast.map(i => i.low));
  }

  evaluateExpression(expression: string): any {
    const evaluationResult = new Function('environment', expression)(this);
    return evaluationResult;
  }

  questionValue(question: string) {
    if (!this.questions) {
      return null;
    }

    const q = this.questions.find(i => i.text.toLowerCase() === question.toLowerCase());
    if (q) {
      return q.answer;
    }

    return null;
  }

  dateDifferenceInDays(date1: Date, date2: Date) {
    return this.dateDifferenceInHours(date1, date2) / 24;
  }

  dateDifferenceInHours(date1: Date, date2: Date) {
    return this.dateDifferenceInMinutes(date1, date2) / 60;
  }

  dateDifferenceInMinutes(date1: Date, date2: Date) {
    return this.dateDifferenceInSeconds(date1, date2) / 60;
  }
  dateDifferenceInSeconds(date1: Date, date2: Date) {
    const differenceInTime = date2.getTime() - date1.getTime();
    return differenceInTime / (1000);
  }


}


@Component({
  templateUrl: './question-wizard.component.html',
  styleUrls: ['./question-wizard.component.css'],
  selector: 'app-question-wizard',

})
export class QuestionWizardComponent implements OnChanges, OnInit {
  @Input() workOrderItemId: string;
  @Input() isComplete = false;
  @Output() isCompleteChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isAuthoProcess = false;
  @Input() internalNotes: any[];
  @Input() hideItemPicture: boolean;
  @Input() questionnaireId: string;
  @Output() answerChange: EventEmitter<null> = new EventEmitter<null>();
  @Input() useOutlineFormField = true;
  @Input() xml: string;
  @Input() objectInScope: any;
  @Input() objectTags: any[];
  @Input() userType: string;
  @Output() sessionVariableChange: EventEmitter<KeyValuePair> = new EventEmitter();
  @Output() questionAnswered: EventEmitter<Question> = new EventEmitter();
  @Input() addressId: string;
  @Input() showGenericProfilePic: boolean = false;
  @Input() useServerParsing = false;
  formId = UtilitiesService.newid();

  commandWorking: boolean;
  commandMessage: string;
  instanceIdTranslations: any = {};

  envVariables: QuestionnaireEnvironmentalVariables = new QuestionnaireEnvironmentalVariables();

  _questionStack: Question[] = [];
  @Input() get questionStack(): Question[] {
    return this._questionStack;
  }
  set questionStack(value: Question[]) {
    this._questionStack = value;
    this.questionStackChange.emit(value);
  }
  @Output() questionStackChange: EventEmitter<Question[]> = new EventEmitter();
  // questionStack: Question[] = [];


  questions: Question[];
  baseUrl: string;
  noQuestions = false;

  loadingQuestions = false;
  timeout: any;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private sanitizer: DomSanitizer,
    private questionParser: QuestionParserService) { }

  ngOnInit() {
    this.envVariables.questions = this.questionStack;
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...

    if (changes.xml && changes.xml.currentValue) {
      if (this.questionStack && this.questionStack.length > 0) {
        this.questionStack = [];
      }
      this.setupSession();
      this.loadingQuestions = true;
      this.setupProcess(changes.xml.currentValue);
      this.loadingQuestions = false;
    }
    if (changes.objectInScope && !changes.objectInScope.currentValue) {
      this.envVariables.objectInScope = null;
    }
    if (changes.objectTags && changes.objectTags.currentValue) {
      this.envVariables.objectTags = changes.objectTags.currentValue;
    } else if (changes.objectTags && !changes.objectTags.currentValue) {
      this.envVariables.objectTags = [];
    } else if (changes.userType) {
      this.envVariables.userType = changes.userType.currentValue;
    }
    if (changes.addressId && changes.addressId.currentValue) {
      this.getForecast();
    }


  }

  answerQuestion(question: Question, answer: Answer) {
    question.answer = answer.text;
    this.showNextQuestion(question.answer, question);
  }

  private getForecast() {
    if (!this.addressId || !this.questions) {
      return;
    }

    let getForecast = false;
    outerLoop:
    for (const question of this.questions) {
      if (question.questionAttributes) {
        for (const attribute of question.questionAttributes) {
          if (attribute.key === 'ENV_EXPRESSION' && attribute.value && attribute.value.indexOf('Forecasted') > -1) {
            getForecast = true;
            break outerLoop;
          }
        }
      }
    }
    if (getForecast) {

    }
  }

  getSanitizedUrl(url: string) {
    url = url.replace(/<\/?[^>]+(>|$)/g, '');
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setupSession() {
    this.envVariables = new QuestionnaireEnvironmentalVariables();
    this.envVariables.questions = this.questionStack;
    if (this.objectInScope) {
      this.envVariables.objectInScope = this.objectInScope;
    }
    if (this.objectTags) {
      this.envVariables.objectTags = this.objectTags;
    }
    this.envVariables.userType = this.userType;
  }

  getItemThumbnailUrl(workOrderItemId: string) {
    return 'https://dev-api.upkeeplabs.com/api/WorkOrderItem/ca7b6e7a-8810-4fbd-8b81-7e6d14b8e9d1/photo';
  }

  get appearance() {
    if (this.useOutlineFormField) {
      return 'outline';
    }
  }

  ids = [];
  getAnswerList(question: Question, visibleOnly = false) {
    let answers: Answer[] = [];
    if (!question) {
      return answers;
    }

    if (question.answers) {
      for (const answer of question.answers) {
        answers.push(answer);
      }
    }

    if (visibleOnly) {
      answers = answers.filter(i => !i.hidden);
    }

    if (this.ids.find(id => id === question.id)) {
    } else {
      this.ids.push(question.id);
    }

    return answers.sort((a, b) => a.geometry.x - b.geometry.x);
  }

  getBrand() {
    const brandQuestion = this.questionStack.find(i => i.originalType === 'BRAND');
    if (brandQuestion) {
      return brandQuestion.answer;
    }
    for (const q of this.questionStack) {
      if ((q.text as string).toLowerCase().startsWith("what brand is")) {
        return q.answer;
      }
    }
    return null;
  }

  getBrandId() {
    const brandQuestion = this.questionStack.find(i => i.originalType === 'BRAND');
    if (brandQuestion && brandQuestion.answers) {
      const answer = brandQuestion.answers.find(i => i.text === brandQuestion.answer);
      if (answer) {
        if (answer.id && answer.id.indexOf('_') > -1) {
          const brandId = answer.id.substring(answer.id.indexOf('_') + 1, answer.id.length);
          return brandId;
        }
        return answer.id;
      }
    }
    for (const q of this.questionStack) {
      if ((q.text as string).toLowerCase().startsWith("what brand is") && q.answers) {
        const answer = q.answers.find(i => i.text === q.answer);

        if (answer) {
          return answer.brandId;
        }
      }
    }
  }

  get questionsJson(): string {
    const simplifiedStack = this.questionStack.map(i => {
      return {
        text: i.text,
        answer: i.answer,
        questionId: i.id,
        answerId: i.answers && i.answers.find(a => a.text === i.answer) ? i.answers.find(a => a.text === i.answer).id : null
      };
    });

    return JSON.stringify(simplifiedStack);
  }

  previousAnswers: any = {};

  showNextQuestion(answer: any, question: Question) {
    if (answer !== null && answer != undefined) {
      this.previousAnswers[question.text] = answer;
    }
    this.answerChange.emit();
    const index = this.questionStack.indexOf(question);

    const answerList = this.getAnswerList(question);
    if (answerList && question.type === 'MULTICHOICE') {
      let answerBuilder = '';
      answerList.forEach(item => {
        if (item.selected) {
          if (answerBuilder) {
            answerBuilder += ', ';
          }
          answerBuilder += item.text;
        }
      });

      question.answer = answerBuilder;
    }

    let clearUpperQuestionStackItems = false;
    if (question.answers) {
      for (const testAnswer of question.answers) {
        if (testAnswer.nextQuestionId) {
          clearUpperQuestionStackItems = true;
        }
      }
    }

    const envRead = this.questionStack.find(i => i.type === 'READ_ENV_VARIABLES');
    if (envRead) {
      clearUpperQuestionStackItems = true;
    }

    // The answer to the question may effect the flow of future questions, any
    // future answered questions need to be cleared out
    if (clearUpperQuestionStackItems && question.type !== 'MODALMESSAGE') {
      while (this.questionStack.length - 1 > index) {
        this.questionStack.pop();
      }
      try {
        clearTimeout(this.timeout);
      } catch (e) { }
    }

    question.answerId = question.answers && question.answers.find(i => i.text === answer) ? question.answers.find(i => i.text === answer).id : null;
    if (question.originalType === 'REPAIR_ITEM' && (!question.meta || !question.meta.repairItemId || question.type !== 'NUMBER')) {
      question.meta = {
        repairItemId: question.meta && question.meta.repairItemId ? question.meta.repairItemId : question.meta,
        repairItemAttributeId: question.type !== 'NUMBER' ? question.id : null,
        repairItemAttributeValueId: question.answerId,
        instanceId: question.instanceId,
      };
    }

    if (question.originalType === 'REPAIR_ITEM') {

      const nextQuestions = this.questions.filter(i => this.questions.indexOf(i) > this.questions.indexOf(question) && i.instanceId === question.instanceId);

      for (const nextQuestion of nextQuestions) {

        const previousQuestions = this.questionStack.filter(i => i.instanceId === nextQuestion.instanceId);

        if (nextQuestion.answers) {
          for (const nextAnswer of nextQuestion.answers) {
            nextAnswer.hidden = false;
            if (nextAnswer.meta) {
              const attribute: any = nextAnswer.meta;

              if (attribute.dependencies && attribute.dependencies.length > 0) {
                try {
                  const dependentIds: string[] = JSON.parse(attribute.dependencies);
                  for (const question of previousQuestions.filter(q => !q.hidden)) {
                    let questionDependentIds = [];
                    for (const a of question.answers) {
                      const foundId = dependentIds.find(id => id === a.id);
                      if (foundId) {
                        questionDependentIds.push(foundId);
                      }
                    }
                    if (questionDependentIds.length > 0) {
                      if (!questionDependentIds.find(i => i === question.answerId)) {
                        nextAnswer.hidden = true;
                      }
                    }
                  }
                } catch (e) { }
              }
              if (nextAnswer.meta.supportNumber) {
              }
            }
          }
        }
      }
    }
    if (question.originalType === 'BRAND') {
      const theAnswer = question.answers.find(i => i.text === answer);
      if (theAnswer && theAnswer.meta) {
        this.envVariables.brand = theAnswer.meta;
      }
    }

    this.questionAnswered.emit(question);
    // We didn't clear out future items and it isn't the last question, so
    // nothing else to do here
    if (!clearUpperQuestionStackItems &&
      index < this.questionStack.length - 1 &&
      question.type !== 'MODALMESSAGE' && question.type !== 'MESSAGE') {
      return;
    }

    if (answerList) {
      for (let i = 0; i < answerList.length; i++) {
        if (answerList[i].text === answer) {
          if (answerList[i].internalNote) {
            this.showInternalNote(answerList[i].internalNote);
          }
        }
      }
    }


    if (answerList) {
      const theAnswerFromList = answerList.find(i => i.text === answer && i.nextQuestionId);
      if (theAnswerFromList) {
        let nextQuestion = this.questions.find(q => q.id === theAnswerFromList.nextQuestionId);
        this.formatQuestionSubstitutionTags(nextQuestion);

        const existingNextQuestion = this.questionStack.find(i => i.id === nextQuestion.id);
        if (existingNextQuestion) {
          nextQuestion = UtilitiesService.copyObject(nextQuestion, null, () => new Question());
          if (!this.instanceIdTranslations[nextQuestion.instanceId]) {
            this.instanceIdTranslations[nextQuestion.instanceId] = UtilitiesService.newid();
          }
          nextQuestion.instanceId = this.instanceIdTranslations[nextQuestion.instanceId];
        }

        if (nextQuestion.type === 'MODALMESSAGE') {
          return;
        }
        nextQuestion.answer = '';
        if (nextQuestion.type === '5STAR') {
          nextQuestion.answer = 1;
        }

        this.addQuestionToStack(nextQuestion);

        if (nextQuestion.type === 'COMPLETE') {
          this.isComplete = true;
          this.isCompleteChange.emit(true);
        } else {
          this.isComplete = false;
          this.isCompleteChange.emit(false);
        }

        if (nextQuestion.type === 'MESSAGE') {
          this.timeout = setTimeout(() => this.showNextQuestion(0, nextQuestion), 3000);
        }
        if (nextQuestion.type === 'VIDEO') {
          setTimeout(() => this.showNextQuestion(0, nextQuestion), 3000);
        }
        if (nextQuestion.type === 'SHOW_IMAGE') {
          setTimeout(() => this.showNextQuestion(0, nextQuestion), 3000);
        }
        if (nextQuestion.type === 'READ_ENV_VARIABLES') {
          this.procesReadEnvVariables(nextQuestion);
        }
        if (nextQuestion.type === 'SAVE_ENV_VARIABLES') {
          this.processWriteEnvVariables(nextQuestion);
        }
        if (nextQuestion.type === 'RUN_COMMAND') {
          this.processRunCommand(nextQuestion);
        }
        if (nextQuestion.type === 'STOP_FLOW') {
          this.processStopFlow(nextQuestion);
        }
        if (nextQuestion.type === 'HAS_REPAIR_ITEM') {
          this.processHasRepairItem(nextQuestion);
        }
        return;
      }
    }

    if (question.nextQuestionId) {
      let nextQuestion = this.questions.find(i => i.id === question.nextQuestionId);
      const existingNextQuestion = this.questionStack.find(i => i.id === nextQuestion.id);

      if (existingNextQuestion) {
        nextQuestion = UtilitiesService.copyObject(nextQuestion, null, () => new Question());
        if (!this.instanceIdTranslations[nextQuestion.instanceId]) {
          this.instanceIdTranslations[nextQuestion.instanceId] = UtilitiesService.newid();
        }
        nextQuestion.instanceId = this.instanceIdTranslations[nextQuestion.instanceId];
      }

      if (nextQuestion.type === 'MODALMESSAGE') {
        alert(nextQuestion.text);
        this.showNextQuestion(0, nextQuestion);
        return;
      }
      nextQuestion.answer = '';
      if (nextQuestion.type === '5STAR') {
        nextQuestion.answer = 1;
      }



      this.addQuestionToStack(nextQuestion);

      if (nextQuestion.type === 'COMPLETE') {
        this.isComplete = true;
        this.isCompleteChange.emit(true);
        return;
      } else {
        this.isComplete = false;
        this.isCompleteChange.emit(false);
      }

      if (nextQuestion.type === 'MESSAGE') {
        setTimeout(() => this.showNextQuestion(0, nextQuestion), 3000);
      }
      if (nextQuestion.type === 'VIDEO') {
        setTimeout(() => this.showNextQuestion(0, nextQuestion), 3000);
      }
      if (nextQuestion.type === 'SHOW_IMAGE') {
        setTimeout(() => this.showNextQuestion(0, nextQuestion), 3000);
      }
      if (nextQuestion.type === 'READ_ENV_VARIABLES') {
        this.procesReadEnvVariables(nextQuestion);
      }
      if (nextQuestion.type === 'SAVE_ENV_VARIABLES') {
        this.processWriteEnvVariables(nextQuestion);
      }
      if (nextQuestion.type === 'RUN_COMMAND') {
        this.processRunCommand(nextQuestion);
      }
      if (nextQuestion.type === 'STOP_FLOW') {
        this.processStopFlow(nextQuestion);
      }
      if (nextQuestion.type === 'HAS_REPAIR_ITEM') {
        this.processHasRepairItem(nextQuestion);
      }

      if (nextQuestion.originalType === "REPAIR_ITEM") {
        if (!nextQuestion.answers.find(a => !a.hidden)) {
          nextQuestion.hidden = true;
          this.showNextQuestion(null, nextQuestion);
        } else {
          nextQuestion.hidden = false;
        }
      }
      return;
    }
  }

  private formatQuestionSubstitutionTags(nextQuestion: Question) {

    if (!nextQuestion.originalText) {
      nextQuestion.originalText = nextQuestion.text;
    }

    if (this.envVariables && this.envVariables.brand) {
      this.envVariables.brand.supportNumber = UtilitiesService.formatPhoneNumber(this.envVariables.brand.supportNumber);
      nextQuestion.text = UtilitiesService.replaceValuesInStringFromObject(nextQuestion.originalText, this.envVariables.brand, 'brand');
    }
  }

  private showInternalNote(note) {
    if (this.internalNotes) {
      const message = { message: note };
      this.internalNotes.push(message);

      setTimeout(() => {
        this.internalNotes.splice(this.internalNotes.indexOf(message), 1);
      }, 1600000);
    }
  }

  private addQuestionToStack(question: Question) {
    if (question.internalNote) {
      this.showInternalNote(question.internalNote);
    }
    this.questionStack.push(question);

    const previousAnswer = this.previousAnswers[question.text];
    if (previousAnswer !== null && previousAnswer !== undefined) {
      question.answer = previousAnswer;
      setTimeout(() => {
        this.showNextQuestion(question.answer, question);
      });
    }

  }

  private async setupProcess(process: string) {
    if (!process) {
      return;
    }
    const parsedValues = await this.questionParser.setupProcess(process);
    const clientParsedValues = await this.questionParser.setupProcess(process);
    const root = parsedValues.questions;
    this.questions = root;
    this.addQuestionToStack(root[0]);
    this.processWriteEnvVariables(root[0]);
    this.procesReadEnvVariables(root[0]);
    this.processRunCommand(root[0]);
    this.processStopFlow(root[0]);
    this.processVideo(root[0]);
    this.processShowImage(root[0]);
    this.processHasRepairItem(root[0]);

    this.getForecast();
    this.doSubstitution();

  }

  private doSubstitution() {
    if (this.questions) {
      for (const question of this.questions) {

        if (question.type === 'VIDEO') {
          question.safeUrl = this.getSanitizedUrl(question.text);
        }
        if (question.type === 'SHOW_IMAGE') {
          question.safeUrl = this.getSanitizedUrl(question.text);
        }
      }
    }
    if (!this.questions || !this.objectInScope) {
      return;
    }

    for (const question of this.questions) {
      question.text = UtilitiesService.replaceValuesInStringFromObject(question.text,
        this.objectInScope,
        'objectInScope');
      if (question.answers) {
        for (const answer of question.answers) {
          answer.text = UtilitiesService.replaceValuesInStringFromObject(answer.text,
            this.objectInScope,
            'objectInScope');
        }
      }

    }
  }

  private processWriteEnvVariables(question: Question) {
    if (question.type === 'SAVE_ENV_VARIABLES') {

      if (question.questionAttributes) {
        const envAttrs = question.questionAttributes.filter(i => i.key.indexOf('ENVVAR_') === 0);
        for (const envAttr of envAttrs) {
          const key = envAttr.key.replace('ENVVAR_', '');
          const value = envAttr.value;
          this.envVariables.sessionVariables[key] = value;
          this.sessionVariableChange.emit({ key, value });
        }
      }
      setTimeout(() => this.showNextQuestion(0, question), 1);
    }
  }

  private procesReadEnvVariables(question: Question) {
    if (question.type === 'READ_ENV_VARIABLES') {

      if (question.questionAttributes) {
        const a = question.questionAttributes.find(i => i.key === 'ENV_EXPRESSION');
        if (a) {

        } else {

        }
      } else {

      }

      const expression = question.questionAttributes ? question.questionAttributes.find(i => i.key === 'ENV_EXPRESSION') : null;

      if (expression) {
        const answer = this.envVariables.evaluateExpression(expression.value);
        // (window as any).envVariables = this.envVariables;
        this.showNextQuestion(answer, question);
      } else {
        console.warn(`No expression setup for step ${question.text}`);
        this.showNextQuestion(0, question);
      }
    }
  }

  private processStopFlow(question: Question) {
    if (question.type === 'STOP_FLOW') {
      this.showNextQuestion(0, question);
    }
  }

  private processVideo(question: Question) {
    if (question.type === 'VIDEO') {
      setTimeout(() => this.showNextQuestion(0, question), 3000);
    }
  }

  private processShowImage(question: Question) {
    if (question.type === 'SHOW_IMAGE') {
      setTimeout(() => this.showNextQuestion(0, question), 3000);
    }
  }

  private processHasRepairItem(question: Question) {

  }

  private async processRunCommand(question: Question) {


  }
}
