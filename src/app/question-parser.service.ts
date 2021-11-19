import { AttributeMarker } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { UtilitiesService } from './utilities';



export class QuestionAttribute {
    key: string;
    value: any;
}

export class Question {
    text: string;
    type: string;
    answers: Answer[];
    id: string;
    nextQuestionId: string;
    internalNote: string;
    answer: any;
    continueOriginalId: string;
    questionAttributes: QuestionAttribute[];
    originalType: string;
    instanceId: string;
    lastQuestionOfInstance: boolean;
    answerId: string;
    meta: any;
    safeUrl: any;
    originalText: string;
    hidden = false;
}

export class Answer {
    text: string;
    id: string;
    nextQuestionId: string;
    internalNote: string;
    parentQuestionId: string;
    geometry: AnswerGeometry;
    selected: boolean;
    continueOriginalId: string;
    meta: any;
    hidden: boolean;
    brandId: string;
}

export class QuestionParserResult {
    questions: Question[];
    questionStack: any;
    allAnswers: Answer[];
    validationWarnings: any;
}

export class AnswerGeometry {
    x: number;
    y: number;
}

@Injectable({
    providedIn: 'root'
})
export class QuestionParserService {
    private typeMap = {
        'ellipse;whiteSpace=wrap;html=1;': 'MULTICHOICE',
        'shape=ext;double=1;rounded=1;whiteSpace=wrap;html=1;': 'NUMBER',
        'ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;': 'DATE',
        'shape=hexagon;perimeter=hexagonPerimeter;whiteSpace=wrap;html=1;':
            'INITIAL',
        'shape=ext;double=1;whiteSpace=wrap;html=1;': '5STAR',
        'shape=document;whiteSpace=wrap;html=1;': 'MULTILINE',
        'shape=note;whiteSpace=wrap;html=1;': 'MESSAGE',
        'shape=card;whiteSpace=wrap;html=1;': 'MODALMESSAGE',
        'rhombus;whiteSpace=wrap;html=1;': 'ANSWER',
        'shape=cylinder;whiteSpace=wrap;html=1;': 'COMPLETE',
        'rounded=1;whiteSpace=wrap;html=1;': 'COMBO',
        'shape=process;whiteSpace=wrap;html=1;': 'TRANSFER',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Dropdown_128x128.png': 'COMBO',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Answer_128x128.png': 'ANSWER',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/process_flow/Home_128x128.png': 'INITIAL',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/process_flow/Finish_128x128.png': 'COMPLETE',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/prompts/Inline_Message_128x128.png': 'MESSAGE',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/prompts/Modal_128x128.png': 'MODALMESSAGE',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Check_List_128x128.png': 'MULTICHOICE',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/process_flow/export_128x128.png': 'TRANSFER',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Multi_Line_128x128.png': 'MULTILINE',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Text_Box_128x128.png': 'TEXTBOX',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Number_128x128.png': 'NUMBER',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Date_128x128.png': 'DATE',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/process_flow/Environmental_Variables_128x128.png': 'READ_ENV_VARIABLES',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/process_flow/Save_Environmental_Variables_128x128.png': 'SAVE_ENV_VARIABLES',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/other/Lightning_128x128.png': 'RUN_COMMAND',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/process_flow/stop_128x128.png': 'STOP_FLOW',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Job_Item_Question_128x128.png': 'REPAIR_ITEM',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Brand_128x128.png': 'BRAND',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/other/Play_Video_128x128.png': 'VIDEO',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/bolt_128x128.png': 'HAS_REPAIR_ITEM',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/upload-image_128x128.png': 'UPLOAD_IMAGE',
        'image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/other/Image_128x128.png': 'SHOW_IMAGE',
        'whiteSpace=wrap;html=1;': 'TEXTBOX',
    };

    constructor() { }



    async setupProcess(process: string, provideDebugInfo: boolean = false): Promise<QuestionParserResult> {
        if (!process) {
            return;
        }
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(process, 'text/xml');
        const cells: Node[] = [];
        const allQuestions: Question[] = [];
        const allAnswers: Answer[] = [];
        const transferredIds = {};

        this.findCells(xmlDoc, cells);
        let root: any = {};

        for (const myCell of cells) {
            const cell: any = myCell;
            if (cell.attributes && cell.attributes.style &&
                (cell.attributes.style.value.indexOf('shape=hexagon') > -1 || cell.attributes.style.value.indexOf('image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/process_flow/Home_128x128.png') > -1)) {
                root = {
                    text: UtilitiesService.replaceAll(cell.attributes.value.value, '&nbsp;', ''),
                    id: cell.attributes.id.value,
                    type: this.getType(cell),
                };
                break;
            }
        }

        const trackedIds = [];
        await this.parseChildLines(root, cells, trackedIds, allQuestions, allAnswers, transferredIds);
        const completeStep = allQuestions.find(i => i.type === 'COMPLETE');
        if (completeStep) {
            for (const question of allQuestions) {
                if (question.type === 'STOP_FLOW') {
                    question.nextQuestionId = completeStep.id;
                }
            }
        }
        for (const answer of allAnswers) {
            if (answer.text) {
                answer.text = answer.text.replace('<div>', '')
                    .replace('</div>', '')
                    .replace('<i>', '')
                    .replace('</i>', '')
                    .replace('<b>', '')
                    .replace('</b>', '')
                    .replace(/<\/?[^>]+(>|$)/g, "");
            }
        }
        if (provideDebugInfo) {

            const allLineCells = cells.filter((i: any) => i.attributes && i.attributes.style && i.attributes.style.value.indexOf('edgeStyle=orthogonalEdgeStyle;') > -1);
            const allQuestionCells = cells.filter((i: any) => i.attributes && i.attributes.style
                && i.attributes.style.value.indexOf('edgeStyle=orthogonalEdgeStyle;') === -1
                && i.attributes.style.value.indexOf('image;html=1;labelBackgroundColor=#ffffff;image=stencils/clipart/questions/Answer_128x128.png') === -1
                && i.attributes.style.value.indexOf('text;') === -1
                && this.typeMap[i.attributes.style.value] !== 'INITIAL'
                && i.id);
            const orphanedLines = allLineCells.filter((i: any) => !i.attributes.source || !i.attributes.target);
            const targetIds = allLineCells.filter((i: any) => i.attributes && i.attributes.target).map((i: any) => i.attributes.target.value);
            const sourceIds = allLineCells.filter((i: any) => i.attributes && i.attributes.source).map((i: any) => i.attributes.source.value);

            const orphanedQuestions = allQuestionCells.filter((i: any) => targetIds.indexOf(i.id) === -1)
                .map((i: any) => { return { text: i.attributes.value.value, id: i.id }; });

            const linesPointingToAnswers = allLineCells.filter((i: any) => i.attributes && i.attributes.target && allAnswers.map(ii => ii.id).indexOf(i.attributes.target.value) > -1
                && allAnswers.map(ii => ii.id).indexOf(i.attributes.source.value) > -1);

            const questionTypesWithAnswers = ['READ_ENV_VARIABLES', 'COMBO', 'MULTICHOICE', 'HAS_REPAIR_ITEM'];
            const questionsThatShouldNotHaveAnswers = allQuestions.filter(i => questionTypesWithAnswers.indexOf(i.type) === -1 && i.answers && i.answers.length > 0);

            const answersWithoutText = allAnswers.filter(i => !i.text);

            const questionTypesThatRequireText = ['COMBO', 'MESSAGE', 'MODALMESSAGE', 'MULTICHOICE', 'MULTILINE', 'TEXTBOX', 'NUMBER', 'DATE'];
            const questionsWithoutText = allQuestions.filter(i => questionTypesThatRequireText.indexOf(i.type) > -1 && !i.text);


            const invalidQuestions = allQuestions.filter(i => i.type !== 'COMPLETE' && i.type !== 'STOP_FLOW' &&
                ((!i.answers || i.answers.length === 0 || i.answers.filter(ii => ii.nextQuestionId).length === 0) && !i.nextQuestionId));

            const invalidTransfers = cells.filter((i: any) => i.attributes && i.attributes.style && this.typeMap[i.attributes.style.value] === 'TRANSFER'
                && sourceIds.indexOf(!i.id ? i.parentNode.id : i.id) === -1)
                .map((i: any) => { return { text: !i.id ? i.parentNode.attributes.label.value : i.id, id: !i.id ? i.parentNode.id : i.id }; });


            const invalidAnswers = allQuestions.filter(i => !i.nextQuestionId).map(i => i.answers.filter(ii => !ii.nextQuestionId))
                .reduce((accumulator, value) => accumulator.concat(value), []);

            for (const answer of invalidAnswers) {
                (answer as any).question = allQuestions.find(i => i.id === answer.parentQuestionId);
            }

            return {
                questions: allQuestions,
                questionStack: root,
                allAnswers,
                validationWarnings: {
                    'Questions Without text': questionsWithoutText,
                    'Answers Without text': answersWithoutText,
                    'Questions That Should not Have Answers': questionsThatShouldNotHaveAnswers,
                    'Answers pointing to Answers': linesPointingToAnswers,
                    'Orphaned Lines': orphanedLines,
                    'Dead-End Questions': invalidQuestions,
                    'Dead-End Answers': invalidAnswers,
                    'Orphaned Questions': orphanedQuestions,
                    'Invalid Transfers': invalidTransfers,
                }
            };
        } else {
            return {
                questions: allQuestions,
                questionStack: null,
                allAnswers: null,
                validationWarnings: null,
            };
        }
    }

    private findCells(node: any, nodesFound: Node[]) {
        if (node.localName === 'mxCell') {
            nodesFound.push(node);
        }

        if (node.childNodes) {
            for (const child of node.childNodes) {
                this.findCells(child, nodesFound);
            }
        }
    }

    private async parseChildLines(parent, cells, trackedIds, allQuestions: Question[], allAnswers: Answer[], transferredIds: any) {
        for (const cell of cells) {
            if (cell.attributes && cell.attributes.source &&
                cell.attributes.target &&
                cell.attributes.source.value === parent.id &&
                cell.attributes.target.value !== parent.id) {
                if (!parent.childLines) {
                    parent.childLines = [];
                }
                parent.childLines.push({
                    id: cell.attributes.id.value,
                    source: cell.attributes.source.value,
                    target: cell.attributes.target.value,
                    type: 'CONNECTION',
                });

            }
        }

        if (parent.childLines) {

            for (const childLine of parent.childLines) {
                await this.parseChildQuestion(childLine, cells, trackedIds, allQuestions, allAnswers, transferredIds);
                let destQuestion = allQuestions.find(i => i.id === childLine.target);
                if (!destQuestion && transferredIds[childLine.target]) {
                    destQuestion = allQuestions.find(i => i.id === transferredIds[childLine.target]);
                }
                if (destQuestion) {
                    const sourceQuestion = allQuestions.find(i => i.id === childLine.source);
                    if (sourceQuestion) {
                        sourceQuestion.nextQuestionId = destQuestion.id;
                    }
                    const sourceAnswer = allAnswers.find(i => i.id === childLine.source);
                    if (sourceAnswer) {
                        sourceAnswer.nextQuestionId = destQuestion.id;
                    }

                    const sourceContinueQuestions = allQuestions.filter(i => i.continueOriginalId === childLine.source);
                    for (const continueQuestion of sourceContinueQuestions) {
                        continueQuestion.nextQuestionId = destQuestion.id;
                    }
                    const sourceContinueAnswers = allAnswers.filter(i => i.continueOriginalId === childLine.source);
                    for (const continueAnswer of sourceContinueAnswers) {
                        continueAnswer.nextQuestionId = destQuestion.id;
                    }
                }

            }

        }
    }

    private async parseChildQuestion(parentConnector, cells, trackedIds, allQuestions: Question[], allAnswers: Answer[], transferredIds: any) {

        for (const cell of cells) {

            const questionAttributes: QuestionAttribute[] = [];

            if ((cell.attributes && cell.attributes.id &&
                cell.attributes.id.value === parentConnector.target) ||
                (cell.parentNode && cell.parentNode.attributes &&
                    cell.parentNode.attributes.id &&
                    cell.parentNode.attributes.id.value === parentConnector.target)) {
                const geometry = { x: 0, y: 0, width: 0, height: 0 };
                for (const childNode of cell.childNodes) {
                    if (childNode.localName === 'mxGeometry') {
                        if (childNode.attributes.x) {
                            geometry.x = parseInt(childNode.attributes.x.value, 10);
                        }
                        if (childNode.attributes.y) {
                            geometry.y = parseInt(childNode.attributes.y.value, 10);
                        }
                        if (childNode.attributes.width) {
                            geometry.width = parseInt(childNode.attributes.width.value, 10);
                        }
                        if (childNode.attributes.height) {
                            geometry.height = parseInt(childNode.attributes.height.value, 10);
                        }
                    }
                }

                let id = null;
                let brandId = null;
                if (cell.attributes && cell.attributes.id) {
                    id = cell.attributes.id.value;
                }
                if (cell.attributes && cell.attributes.brandId) {
                    brandId = cell.attributes.brandId.value;
                }

                if (!id && cell.parentNode && cell.parentNode.attributes &&
                    cell.parentNode.attributes.id) {
                    id = cell.parentNode.attributes.id.value;
                }

                if (cell.attributes && trackedIds.indexOf(id) === -1) {
                    let text = null;

                    if (cell.attributes && cell.attributes.value) {
                        text = UtilitiesService.replaceAll(cell.attributes.value.value, '&nbsp;', ' ');
                    }

                    if (!text && cell.parentNode && cell.parentNode.attributes &&
                        cell.parentNode.attributes.label) {
                        text = UtilitiesService.replaceAll(cell.parentNode.attributes.label.value, '&nbsp;', ' ');
                    }

                    let internalNote = null;
                    if (cell.parentNode && cell.parentNode.attributes &&
                        cell.parentNode.attributes.INTERNAL_NOTE) {
                        internalNote = cell.parentNode.attributes.INTERNAL_NOTE.value;
                    }
                    for (let i = 0; i < cell.parentNode.attributes.length; i++) {
                        const attr = cell.parentNode.attributes[i];
                        if (attr.nodeName !== 'label' && attr.nodeName !== 'placeholders') {
                            // addTextArea(count, attrs[i].nodeName, attrs[i].nodeValue);
                            questionAttributes.push({ key: attr.name, value: attr.value });
                            // count++;
                        }
                    }

                    parentConnector.childQuestion = {
                        text,
                        id,
                        type: this.getType(cell),
                        answer: '',
                        geometry,
                        internalNote,
                        brandId,
                    };

                    if (parentConnector.childQuestion.type !== 'ANSWER' && parentConnector.childQuestion.type !== 'TRANSFER' && parentConnector.childQuestion.type !== 'REPAIR_ITEM') {
                        const question = new Question();
                        question.id = parentConnector.childQuestion.id;
                        question.text = UtilitiesService.replaceAll(parentConnector.childQuestion.text, '&nbsp;', ' ');
                        question.type = parentConnector.childQuestion.type;
                        question.answers = [];
                        question.questionAttributes = questionAttributes;
                        question.internalNote = parentConnector.childQuestion.internalNote;
                        let counter = 0;

                        allQuestions.push(question);
                    } else {
                        const answer = new Answer();
                        const childQuestion = parentConnector.childQuestion;
                        answer.id = parentConnector.childQuestion.id;
                        answer.text = UtilitiesService.replaceAll(childQuestion.text, '&nbsp;', ' ');
                        answer.brandId = childQuestion.brandId;
                        answer.geometry = parentConnector.childQuestion.geometry;
                        answer.internalNote = parentConnector.childQuestion.internalNote;

                        const sourceId = parentConnector.source;

                        const parentQuestion = allQuestions.filter(i => i.id === sourceId)[0];
                        if (parentQuestion) {
                            parentQuestion.answers.push(answer);
                            answer.parentQuestionId = parentQuestion.id;
                        }
                        allAnswers.push(answer);
                    }
                    trackedIds.push(id);
                } else {
                    parentConnector.childQuestionId = id;
                }

                break;
            }
        }

        if (parentConnector.childQuestion) {
            await this.parseChildLines(parentConnector.childQuestion, cells, trackedIds, allQuestions, allAnswers, transferredIds);
        }
    }


    private getType(cell) {
        if (!cell.attributes.style) {
            return;
        }
        const style = cell.attributes.style.value;


        for (const property in this.typeMap) {
            if (style.indexOf(property) > -1) {
                return this.typeMap[property];
            }
        }
    }
}
