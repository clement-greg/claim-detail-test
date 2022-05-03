import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
declare var joint: any;
declare var $: any;
declare var _: any;
declare var V: any;

@Component({
  selector: 'app-graph-test',
  templateUrl: './graph-test.component.html',
  styleUrls: ['./graph-test.component.css']
})
export class GraphTestComponent implements OnInit {
  private scriptsToLoad = [
    'jquery',
    'lodash',
    'backbone',
    'joint.min',
    //'rappid'
  ];
  groupedTools: any[] = [];
  filteredGroupTools: any[] = [];
  paper: any;
  graph: any;
  selectedModel: any;
  switchValue: string;
  toolFilter: string;

  typeMap: any[] = [{
    url: '/assets/images/start.png',
    hasTransmissionLineIn: false,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Start',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/if-else.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Expression'],
    transmissionOutPortLabels: ['True', 'False'],
    title: 'If/Else',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/is-null.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Expression'],
    transmissionOutPortLabels: ['True', 'False'],
    title: 'Is Null',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/send-email.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['To', 'From', 'Subject', 'Message'],
    transmissionOutPortLabels: [''],
    title: 'Send Email',
    category: 'Communication'
  },
  {
    url: '/assets/images/equals.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Value 1', 'Value 2'],
    transmissionOutPortLabels: ['True', 'False'],
    title: 'Equals',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/object-in-scope.png',
    hasTransmissionLineIn: false,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [],
    title: 'Get Object In Scope',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/get-object-value.png',
    hasTransmissionLineIn: false,
    hasOutputPort: true,
    inputPortLabels: ['Object', 'Field'],
    transmissionOutPortLabels: [],
    title: 'Get Object value',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/loop.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Array'],
    transmissionOutPortLabels: ['Loop', 'Completion'],
    title: 'Loop',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/first.png',
    hasTransmissionLineIn: false,
    hasOutputPort: true,
    inputPortLabels: ['Array'],
    transmissionOutPortLabels: [],
    title: 'First',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/wait.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Seconds'],
    transmissionOutPortLabels: [''],
    title: 'Wait',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/switch.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Value'],
    transmissionOutPortLabels: ['_Default'],
    title: 'switch',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/auto-call.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Phone', 'Message To Read'],
    transmissionOutPortLabels: [''],
    title: 'Auto Phone Call',
    category: 'Communication'
  },
  {
    url: '/assets/images/broadcast.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Application Key', 'Message'],
    transmissionOutPortLabels: [''],
    title: 'Broadcast Application Message',
    category: 'Communication'
  },
  {
    url: '/assets/images/phone.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Phone #'],
    transmissionOutPortLabels: [''],
    title: 'Dial Number',
    category: 'Communication'
  },
  {
    url: '/assets/images/process.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Workflow Id', 'Object Type', 'Object Id'],
    transmissionOutPortLabels: [''],
    title: 'Run Workflow',
    category: 'Communication'
  },
  {
    url: '/assets/images/app-notification.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Message Recipients', 'Title', 'Message', 'Endpoint URL'],
    transmissionOutPortLabels: [''],
    title: 'Send App Notification',
    category: 'Communication'
  },
  {
    url: '/assets/images/cogent-notification.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Employees', 'Message', 'Endpoint URL'],
    transmissionOutPortLabels: [''],
    title: 'Send Cogent Notification',
    category: 'Communication'
  },
  {
    url: '/assets/images/sms.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Recipients', 'Message'],
    transmissionOutPortLabels: [''],
    title: 'Send SMS Notification',
    category: 'Communication'
  },
  {
    url: '/assets/images/sly-dial.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Phone #', 'Message Id'],
    transmissionOutPortLabels: [''],
    title: 'Sly Dial',
    category: 'Communication'
  },
  // {
  //   url: '/assets/images/form.png',
  //   hasTransmissionLineIn: true,
  //   hasOutputPort: true,
  //   inputPortLabels: ['Form Id'],
  //   transmissionOutPortLabels: [''],
  //   title: 'Show Form',
  //   category: 'Input'
  // },
  // {
  //   url: '/assets/images/questionnaire.png',
  //   hasTransmissionLineIn: true,
  //   hasOutputPort: true,
  //   inputPortLabels: ['Questionnaire Id'],
  //   transmissionOutPortLabels: [''],
  //   title: 'Show Questionnaire',
  //   category: 'Input'
  // },
  // {
  //   url: '/assets/images/questionnaire-answer.png',
  //   hasTransmissionLineIn: false,
  //   hasOutputPort: true,
  //   inputPortLabels: ['Questionnaire'],
  //   transmissionOutPortLabels: [],
  //   title: 'Get Questionnaire Answer',
  //   category: 'Output'
  // },
  {
    url: '/assets/images/end-process.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Result'],
    transmissionOutPortLabels: [],
    title: 'End Process',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/transfer.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Process JSON', 'Object In Scope'],
    transmissionOutPortLabels: ['Resume'],
    title: 'Transfer',
    category: 'Control Flow'
  },
  // {
  //   url: '/assets/images/save-env-variable.png',
  //   hasTransmissionLineIn: true,
  //   hasOutputPort: false,
  //   inputPortLabels: ['Key', 'Value'],
  //   transmissionOutPortLabels: [''],
  //   title: 'Save Environment Variable',
  //   category: 'Control Flow'
  // },
  // {
  //   url: '/assets/images/read-env-variable.png',
  //   hasTransmissionLineIn: false,
  //   hasOutputPort: true,
  //   inputPortLabels: ['Key'],
  //   transmissionOutPortLabels: [],
  //   title: 'Read Environment Variable',
  //   category: 'Control Flow'
  // },
  {
    url: '/assets/images/stop-flow.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [],
    title: 'Stop Flow',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/single-select.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: ['_Default'],
    title: 'Single Item Select',
    category: 'Input'
  },
  {
    url: '/assets/images/check-list.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Check List',
    category: 'Input'
  },
  {
    url: '/assets/images/multi-line-textbox.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Multi-line textbox',
    category: 'Input'
  },
  {
    url: '/assets/images/text-box.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Text Box',
    category: 'Input'
  },
  {
    url: '/assets/images/number-box.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Number Box',
    category: 'Input'
  },
  {
    url: '/assets/images/repair-item.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Repair Item',
    category: 'Input'
  },
  {
    url: '/assets/images/brand.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Brand',
    category: 'Input'
  },
  {
    url: '/assets/images/has-repair-item.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Repair Item Id', 'Policy Id'],
    transmissionOutPortLabels: ['True', 'False'],
    title: 'Has Repair Item',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/date-box.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Date Box',
    category: 'Input'
  },
  {
    url: '/assets/images/upload-image.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Upload Image',
    category: 'Input'
  },
  {
    url: '/assets/images/weather.png',
    hasTransmissionLineIn: false,
    hasOutputPort: true,
    inputPortLabels: ['Postal Code'],
    transmissionOutPortLabels: [],
    title: 'Weather Forecast',
    category: 'Data'
  },
  {
    url: '/assets/images/show-activity-indicator.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Message'],
    transmissionOutPortLabels: [''],
    title: 'Show Activity Indicator',
    category: 'Output'
  },
  {
    url: '/assets/images/hide-activity-indicator.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Hide Activity Indicator',
    category: 'Output'
  },
  {
    url: '/assets/images/change-lane.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Change Lane',
    category: 'Data'
  },
  {
    url: '/assets/images/navigate-to-url.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['URL', 'Target'],
    transmissionOutPortLabels: [''],
    title: 'Navigate To Url',
    category: 'Output'
  },
  {
    url: '/assets/images/refresh-all.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Refresh All',
    category: 'Data'
  },
  {
    url: '/assets/images/refresh.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Refresh',
    category: 'Data'
  },
  {
    url: '/assets/images/remove-from-queue.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Remove From Queue',
    category: 'Data'
  },
  {
    url: '/assets/images/alert-dialog.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Subject', 'Message'],
    transmissionOutPortLabels: [''],
    title: 'Alert Dialog',
    category: 'Output'
  },
  {
    url: '/assets/images/confirm-dialog.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Subject', 'Message'],
    transmissionOutPortLabels: ['True', 'False'],
    title: 'Confirm Dialog',
    category: 'Output'
  },
  {
    url: '/assets/images/toast-message.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Message'],
    transmissionOutPortLabels: [''],
    title: 'Toast Message',
    category: 'Output'
  },
  {
    url: '/assets/images/toast-success.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Message'],
    transmissionOutPortLabels: [''],
    title: 'Toast Success Message',
    category: 'Output'
  },
  {
    url: '/assets/images/undo.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Message'],
    transmissionOutPortLabels: ['Undo', 'Default'],
    title: 'Show Undo',
    category: 'Output'
  },

  {
    url: '/assets/images/begin-form.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Form Container Id'],
    transmissionOutPortLabels: [''],
    title: 'Begin Form',
    category: 'Input'
  },

  {
    url: '/assets/images/rich-text.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Label', 'Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Rich Text',
    category: 'Input'
  },

  {
    url: '/assets/images/slider.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Label', 'Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Slider',
    category: 'Input'
  },

  {
    url: '/assets/images/email-box.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Label', 'Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Email Box',
    category: 'Input'
  },

  {
    url: '/assets/images/phone-box.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Label', 'Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Phone Box',
    category: 'Input'
  },

  {
    url: '/assets/images/slide-toggle.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Label', 'Default Value'],
    transmissionOutPortLabels: [''],
    title: 'Check box', 
    category: 'Input'
  },

  {
    url: '/assets/images/end-form.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'End Form',
    category: 'Input'
  },

  {
    url: '/assets/images/message.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Message'],
    transmissionOutPortLabels: [''],
    title: 'Message',
    category: 'Output'
  },

  {
    url: '/assets/images/heading.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Message'],
    transmissionOutPortLabels: [''],
    title: 'Heading',
    category: 'Output'
  },

  {
    url: '/assets/images/separator.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Separator',
    category: 'Output'
  },

  {
    url: '/assets/images/tag-entry.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Tag Entry',
    category: 'Input'
  },

  {
    url: '/assets/images/preferred-time-slots.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [''],
    title: 'Preferred Time Slots',
    category: 'Input'
  },

  {
    url: '/assets/images/create-task.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Employees', 'Task Queue Id', 'Message'],
    transmissionOutPortLabels: [''],
    title: 'Create Task',
    category: 'Data'
  },

  {
    url: '/assets/images/create-binding-object.png',
    hasTransmissionLineIn: false,
    hasOutputPort: true,
    inputPortLabels: [],
    transmissionOutPortLabels: [],
    title: 'Create Binding Object',
    category: 'Data'
  },

  {
    url: '/assets/images/template-binding.png',
    hasTransmissionLineIn: false,
    hasOutputPort: true,
    inputPortLabels: ['Template', 'Object'],
    transmissionOutPortLabels: [],
    title: 'Bind Template',
    category: 'Data'
  },

  {
    url: '/assets/images/rest.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['URL', 'Method', 'Body'],
    transmissionOutPortLabels: [''],
    title: 'REST',
    category: 'Data'
  },

  {
    url: '/assets/images/connect-task.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
    inputPortLabels: ['Contact Flow Id', 'Task Name', 'Description', 'URL'],
    transmissionOutPortLabels: [''],
    title: 'Connect Task',
    category: 'Communication'
  },
  
  



    //

  ];



  doShape(shape) {
    const constructedShape = this.constructImageShape(shape.url, shape.hasTransmissionLineIn, shape.hasOutputPort, shape.inputPortLabels, shape.transmissionOutPortLabels, shape.title, shape.height, shape.width);
    constructedShape.addTo(this.graph);

    constructedShape.on('change:position', e => this.doElementMove(e));

    return constructedShape;
  }

  addSwitchOutput() {
    this.selectedModel.addPort({
      group: 'transmissionOut',
      attrs: {
        label: {
          text: this.switchValue
        }
      }
    });

    const outputPortCount = this.selectedModel.attributes.ports.items.filter(i => i.group === 'transmissionOut').length;
    let height = outputPortCount * 22;
    if (height < 100) {
      height = 100;
    }

    this.selectedModel.resize(150, height);

    this.switchValue = null;
  }

  addBindingInput() {
    this.selectedModel.addPort({
      group: 'in',
      attrs: {
        label: {
          text: this.switchValue
        }
      }
    });

    const inputPortCount = this.selectedModel.attributes.ports.items.filter(i => i.group === 'in').length;
    let height = inputPortCount * 22;
    if (height < 100) {
      height = 100;
    }

    this.selectedModel.resize(150, height);

    this.switchValue = null;
  }

  shapeDrag(shape) {

  }

  removePort(port) {
    this.selectedModel.removePort(port);
  }

  handleFormItemResort($event, group = 'transmissionOut') {
    const outputPorts = this.selectedModel.attributes.ports.items.filter(i => i.group ===  group);
    moveItemInArray(outputPorts, $event.previousIndex, $event.currentIndex);

    for (const port of outputPorts) {
      this.selectedModel.removePort(port);
    }
    for (const port of outputPorts) {
      this.selectedModel.addPort(port);
    }
  }



  get transmissionOutPorts() {
    if (!this.selectedModel) {
      return null;
    }

    return this.selectedModel.attributes.ports.items.filter(i => i.group === 'transmissionOut');
  }

  get inPorts() {
    if (!this.selectedModel) {
      return null;
    }

    return this.selectedModel.attributes.ports.items.filter(i => i.group === 'in');
  }

  removeAnswer(answer: string) {
    this.selectedModel?.attributes?.custom?.answers.splice(this.selectedModel?.attributes?.custom?.answers.indexOf(answer), 1);
  }

  handleAnswersSort($event) {
    moveItemInArray(this.selectedModel?.attributes?.custom?.answers, $event.previousIndex, $event.currentIndex);
  }


  addChecklistOutput() {
    if (!this.selectedModel.attributes.custom.answers) {
      this.selectedModel.attributes.custom.answers = [];
    }
    this.selectedModel?.attributes?.custom?.answers.push(this.switchValue);
    this.switchValue = '';
  }


  get answers() {
    return this.selectedModel?.attributes?.custom?.answers;
  }

  updateShapeTitle(title: string) {
    this.selectedModel.attr({
      label: {
        text: title,
      }
    });
  }


  private constructImageShape(url: string, hasTransmissionLineIn: boolean, hasOutputPort: boolean, inputPortLabels: string[], transmissionOutPortLabels: string[], title: string, height = 100, width = 100) {
    if (!height) {
      height = 100;
    }
    if (!width) {
      width = 100;
    }
    const def = joint.shapes.standard.Image.define(url, {
      attrs: {
        root: {
          magnet: false,
          title: title,
        },
        // label: {
        //   text: 'Image'
        // },,

        image: {
          xlinkHref: url,
        }
      },
      ports: {
        groups: {
          in: {
            label: {
              position: {
                name: 'left'
              },
              markup: [{
                tagName: 'text',
                selector: 'label'
              }]
            },
            position: { name: 'left' },
            attrs: {
              portBody: {
                magnet: 'passive',
                r: 5,
                cy: 0,
                cx: 0,
                fill: '#669984',
              }
            },
            z: 1
          },
          out: {
            position: { name: 'bottom' },
            attrs: {
              portBody: {
                magnet: 'active',
                r: 7,
                cy: 0,
                fill: '#6B6699',
              }
            },
            z: 1
          },
          transmissionIn: {
            position: { name: 'top' },
            attrs: {
              portBody: {
                magnet: 'passive',
                r: 5,
                cy: 0,
                fill: '#99667B',
              }
            },
            z: 0
          },
          transmissionOut: {
            position: { name: 'right' },
            label: {
              position: {
                name: 'right'
              },
              markup: [{
                tagName: 'text',
                selector: 'label'
              }]
            },
            attrs: {
              portBody: {
                magnet: 'active',
                r: 7,
                cy: 0,
                cx: 0,
                fill: '#949966',
              },
              label: {
                text: 'True'
              },

            },
            z: 1
          }
        }
      }
    }, {

      portMarkup: [{ tagName: 'circle', selector: 'portBody' }],

    });
    const shape = new def();
    if (hasTransmissionLineIn) {
      shape.addPort({ group: 'transmissionIn' });
    }
    shape.resize(width, height);
    if (hasOutputPort) {
      shape.addPort({ group: 'out' });
    }
    if (inputPortLabels) {
      for (const label of inputPortLabels) {
        shape.addPort({
          group: 'in',
          attrs: {
            label: {
              text: label
            }
          }
        });
      }
    }
    if (transmissionOutPortLabels) {
      for (const label of transmissionOutPortLabels) {
        shape.addPort({
          group: 'transmissionOut',
          attrs: {
            label: {
              text: label
            }
          }
        });
      }
    }

    return shape;

  }

  dragged;
  constructor(private zone: NgZone, private snackbar: MatSnackBar, private clipboard: Clipboard) {

    /* events fired on the draggable target */
    document.addEventListener("drag", function (event) {

    }, false);

    document.addEventListener("dragstart", (event: any) => {
      // store a ref. on the dragged elem
      this.dragged = event.target;
      // make it half transparent
      event.target.style.opacity = .5;
    }, false);

    document.addEventListener("dragend", (event: any) => {
      // reset the transparency
      event.target.style.opacity = "";
    }, false);

    /* events fired on the drop targets */
    document.addEventListener("dragover", (event) => {
      // prevent default to allow drop
      event.preventDefault();

    }, false);



    this.setGroupedTools(this.typeMap);





    document.addEventListener("drop", (event: any) => {
      event.preventDefault();
      const shape = this.typeMap.find(i => i.url === this.dragged.getAttribute('data-url'));
      const constructedShape = this.doShape(shape);
      constructedShape.position(event.layerX, event.layerY);
      this.fitContent();
    }, false);
  }

  setGroupedTools(tools) {
    const results = [];
    this.filteredGroupTools = [];
    for (const tool of tools) {
      let group = results.find(i => i.category === tool.category);
      if (!group) {
        group = { category: tool.category, items: [], expanded: true }
        results.push(group);
      }
      group.items.push(tool);
    }

    this.filteredGroupTools = results;
  }

  ngOnInit(): void {
    if (typeof joint === 'undefined') {
      this.loadScripts();
    } else {
      this.doJointStuff();
    }
  }

  deleteShape() {
    this.selectedModel.remove();
    this.selectedModel = null;
  }

  doToolFilter() {
    if (!this.toolFilter) {
      this.setGroupedTools(this.typeMap);
    } else {
      const lowerFilter = this.toolFilter.toLocaleLowerCase();
      const filteredItems = this.typeMap.filter(i => i.category.toLocaleLowerCase().indexOf(lowerFilter) > -1 || i.title.toLocaleLowerCase().indexOf(lowerFilter) > -1 || i.url.toLocaleLowerCase().indexOf(lowerFilter) > -1);
      this.setGroupedTools(filteredItems);
    }
  }

  saveGraph() {
    const json = this.graph.toJSON();
    localStorage.setItem('graph', JSON.stringify(json));
    this.snackbar.open('Graph Saved', null, { duration: 3000 });
  }

  async copy() {
    const json = this.graph.toJSON();
    //await this.clipboard.writeText(json);
    this.clipboard.copy(JSON.stringify(json));
  }

  private dragTimeout;

  loadGraph() {
    const json = localStorage.getItem('graph');
    const jsonObject = JSON.parse(json);
    for (const shape of this.typeMap) {
      this.constructImageShape(shape.url, shape.hasTransmissionLineIn, shape.hasOutputPort, shape.inputPortLabels, shape.transmissionOutPortLabels, shape.title, shape.height, shape.width);
    }


    this.graph.fromJSON(jsonObject);
    for (const model of this.graph.attributes.cells.models) {
      model.on('change:position', e => this.doElementMove(e));
    }
    this.fitContent();
  }

  private doElementMove(e) {
    this.fitContent();

    clearTimeout(this.dragTimeout);
    this.dragTimeout = setTimeout(() => {
      if (e.attributes.position.x < 0) {
        e.position(0, e.attributes.position.y);
        this.fitContent();
      }
      if (e.attributes.position.y < 0) {
        e.position(e.attributes.position.x, 0);
        this.fitContent();
      }
    }, 500);
  }




  private loadScripts() {

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = '/assets/css/joint.min.css';

    document.body.appendChild(css);

    if (this.scriptsToLoad.length > 0) {
      const script = this.scriptsToLoad[0];

      const scriptEl = document.createElement('script');
      scriptEl.type = 'text/javascript';
      // scriptEl.async = true;
      document.body.appendChild(scriptEl);
      scriptEl.src = `/assets/js/${script}.js`;
      scriptEl.onload = e => {
        this.scriptsToLoad = this.scriptsToLoad.slice(1, this.scriptsToLoad.length);

        if (this.scriptsToLoad.length > 0) {
          this.loadScripts();
        } else {
          // TODO: begin page stuff;
          this.doJointStuff();
        }
      };
    }

  }

  fitContent() {
    this.paper.fitToContent({
      gridWidth: 100,
      gridHeight: 100,
      padding: 100,
    });
  }

  private doJointStuff() {

    var magnetAvailabilityHighlighter = {
      name: 'stroke',
      options: {
        padding: 6,
        attrs: {
          'stroke-width': 3,
          'stroke': 'red'
        }
      }
    };

    var graph = new joint.dia.Graph;
    this.graph = graph;

    var paper = new joint.dia.Paper({
      el: document.getElementById('paper'),
      model: graph,
      gridSize: 1,
      linkPinning: false,
      snapLinks: true,
      defaultLink: function (cellView, magnet) {
        return new joint.shapes.standard.Link({
          z: -1,
          attrs: {
            line: {
              stroke: V(magnet).attr('port-group') === "transmissionOut" ? "red" : "#ccc",
              strokeWidth: V(magnet).attr('port-group') === "transmissionOut" ? 1 : 1,
              strokeDashArray: V(magnet).attr('port-group') === "transmissionOut" ? '4 1' : 'none',
            }
          },
          // router: {
          //   name: 'normal'
          // },
          // connector: {
          //   name: 'rounded'
          // }
        })
      },
      defaultConnector: { name: 'smooth' },
      defaultConnectionPoint: { name: 'boundary' },
      markAvailable: true,
      validateMagnet: function (cellView, magnet) {
        const magnetPortId = magnet.getAttribute('port');
        const usedPorts = graph.getConnectedLinks(cellView.model).map(i => i.attributes.source.port);
        const portDef = cellView.model.attributes.ports.items.find(i => i.id === magnetPortId);
        console.log(portDef);

        if (portDef.group === 'in' || portDef.group === 'transmissionIn') {
          return false;
        }

        if (portDef.group === 'transmissionOut' && usedPorts.indexOf(magnetPortId) > -1) {
          return false;
        }
        return true;
      },
      validateConnection: function (vS, mS, vT, mT, end, lV) {
        if (!mT) return false;
        if (vS === vT) return false;
        const outPortGroup = mS.getAttribute('port-group');
        const inPortGroup = mT.getAttribute('port-group');
        if (outPortGroup === 'transmissionOut' && inPortGroup === 'transmissionIn') {
          return true;
        }

        if (outPortGroup === 'out' && inPortGroup === 'in' && vT) {
          const targetPortId = mT.getAttribute('port');
          const usedPorts = graph.getConnectedLinks(vT.model).map(i => i.attributes.target.port);
          if (usedPorts.indexOf(targetPortId) > -1) {
            return false;
          }
          return true;
        }

        if (mT.getAttribute('port-group') !== 'in') return false;
        return false;
      }
    });
    this.paper = paper;


    paper.options.highlighting.magnetAvailability = magnetAvailabilityHighlighter;

    paper.on('link:mouseenter', function (linkView) {
      var tools = new joint.dia.ToolsView({
        tools: [
          new joint.linkTools.TargetArrowhead(),
          new joint.linkTools.Remove({ distance: -30 })
        ]
      });
      linkView.addTools(tools);
    });

    paper.on('link:mouseleave', function (linkView) {
      linkView.removeTools();
    });

    paper.on('link:pointerdblclick', (link) => {
      this.graph.removeCells(link.model);
    });

    paper.on('element:pointerdblclick', (elementView) => {
      elementView.model.remove();
      this.selectedModel = null;
    });

    paper.on('element:pointerclick', (elementView) => {

      this.zone.run(() => {
        this.selectedModel = elementView.model;
        if (!this.selectedModel.attributes.custom) {
          this.selectedModel.prop('custom', { inputs: [] });
        } if (!this.selectedModel.attributes.custom.inputs) {
          this.selectedModel.attributes.custom.inputs = [];
        }


        const inputPorts = this.selectedModel.attributes.ports.items.filter(i => i.group === 'in');
        const usedPorts = this.graph.getConnectedLinks(this.selectedModel).map(i => i.attributes.target.port);

        for (const inputPort of inputPorts) {
          let customInput = this.selectedModel.attributes.custom.inputs.find(i => i.id === inputPort.id);
          if (!customInput) {
            customInput = {
              id: inputPort.id,
              value: '',
              portConnected: false,
              label: inputPort.attrs?.label?.text,
            };
            this.selectedModel.attributes.custom.inputs.push(customInput);
          }

        }
        for (const customInput of this.selectedModel.attributes.custom.inputs) {
          customInput.portConnected = false;
        }

        for (const portId of usedPorts) {
          const foundInput = this.selectedModel.attributes.custom.inputs.find(i => i.id === portId);
          if (foundInput) {
            foundInput.portConnected = true;
          }
        }

      });
    });
    setTimeout(() => window.scrollTo(0, 0), 2000);
    window.scrollTo(0, 0);
  }
}
