import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var joint: any;
declare var $: any;
declare var _: any;

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
    'joint',
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
    inputPortLabels: ['Object'],
    transmissionOutPortLabels: [],
    title: 'Get Object value',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/loop.png',
    hasTransmissionLineIn: true,
    hasOutputPort: false,
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
    url: '/assets/images/switch.png',
    hasTransmissionLineIn: true,
    hasOutputPort: true,
    inputPortLabels: ['Value'],
    transmissionOutPortLabels: [],
    title: 'switch',
    category: 'Control Flow'
  },
  {
    url: '/assets/images/auto-call.png',
    hasTransmissionLineIn: false,
    hasOutputPort: false,
    inputPortLabels: ['Phone'],
    transmissionOutPortLabels: [''],
    title: 'Auto Phone Call',
    category: 'Communication'
  },
  {
    url: '/assets/images/broadcast.png',
    hasTransmissionLineIn: false,
    hasOutputPort: false,
    inputPortLabels: ['Application Key', 'Message'],
    transmissionOutPortLabels: [''],
    title: 'Broadcast Application Message',
    category: 'Communication'
  },
  {
    url: '/assets/images/phone.png',
    hasTransmissionLineIn: false,
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
    inputPortLabels: ['Employees', 'Title', 'Message', 'Endpoint URL'],
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

    this.switchValue = null;
  }

  shapeDrag(shape) {
    console.log('dragging shape')
  }

  removePort(port) {
    this.selectedModel.removePort(port);
  }

  get transmissionOutPorts() {
    if (!this.selectedModel) {
      return null;
    }

    return this.selectedModel.attributes.ports.items.filter(i => i.group === 'transmissionOut');
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
        // },
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
                r: 7,
                cy: 0,
                cx: -7,
                fill: 'darkblue',
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
                cy: 4,
                fill: 'lightblue',
              }
            },
            z: 1
          },
          transmissionIn: {
            position: { name: 'top' },
            attrs: {
              portBody: {
                magnet: 'passive',
                r: 7,
                cy: -4,
                fill: 'yellow',
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
                cx: 7,
                fill: 'pink',
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
  constructor(private zone: NgZone, private snackbar: MatSnackBar) {

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
      console.log('drop')
      console.log(event);
      console.log(this.dragged);
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // // move dragged elem to the selected drop target
      // if (event.target.className == "dropzone") {
      //   event.target.style.background = "";
      //   this.dragged.parentNode.removeChild(this.dragged);
      //   event.target.appendChild(this.dragged);
      // }
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
    this.loadScripts();
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
      const filteredItems = this.typeMap.filter(i => i.category.toLocaleLowerCase().indexOf(lowerFilter) > -1 || i.title.toLocaleLowerCase().indexOf(lowerFilter) > -1 && i.url.toLocaleLowerCase().indexOf(lowerFilter) > -1);
      this.setGroupedTools(filteredItems);
    }
  }

  saveGraph() {
    const json = this.graph.toJSON();
    console.log(json);
    localStorage.setItem('graph', JSON.stringify(json));
    this.snackbar.open('Graph Saved', null, { duration: 3000 });
  }

  private dragTimeout;

  loadGraph() {
    const json = localStorage.getItem('graph');
    const jsonObject = JSON.parse(json);
    for (const shape of this.typeMap) {
      this.constructImageShape(shape.url, shape.hasTransmissionLineIn, shape.hasOutputPort, shape.inputPortLabels, shape.transmissionOutPortLabels, shape.title, shape.height, shape.width);
    }

    //const shape = this.constructImageShape('/assets/images/start.png', false, false, [], [''], 'Start');

    this.graph.fromJSON(jsonObject);
    console.log(this.graph);
    for (const model of this.graph.attributes.cells.models) {
      model.on('change:position', e => this.doElementMove(e));
    }
    this.fitContent();
  }

  private doElementMove(e) {
    this.fitContent();

    // console.log(e);
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
    css.href = '/assets/css/rappid.css';

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
      defaultLink: new joint.shapes.standard.Link({
        z: - 1, attrs: {
          line: {
            stroke: '#ccc',
            strokeWidth: 1
          },
        }
      }),
      defaultConnector: { name: 'smooth' },
      defaultConnectionPoint: { name: 'boundary' },
      markAvailable: true,
      validateConnection: function (vS, mS, vT, mT, end, lV) {
        // console.log({ vS, mS, vT, mT, end, lV });
        if (!mT) return false;
        if (vS === vT) return false;
        const outPortGroup = mS.getAttribute('port-group');
        const inPortGroup = mT.getAttribute('port-group');
        if (outPortGroup === 'transmissionOut' && inPortGroup === 'transmissionIn') {
          console.log('is true')
          return true;
        }

        if (outPortGroup === 'out' && inPortGroup === 'in') {
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

    paper.on('element:pointerclick', (elementView) => {

      this.zone.run(() => {
        //this.lastUpdateDate = new Date();
        this.selectedModel = elementView.model;
        console.log(this.selectedModel);
        if (!this.selectedModel.attributes.custom) {
          this.selectedModel.prop('custom', {});
        }
      });
    });


    setTimeout(() => window.scrollTo(0, 0), 2000);
    window.scrollTo(0, 0);

  }


}
