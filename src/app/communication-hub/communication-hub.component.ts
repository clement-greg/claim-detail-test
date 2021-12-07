import { Component, OnInit } from '@angular/core';

enum CommunicationType {
  Voice,
  Text,
  Email,
  WebChat,
  VoiceChat,
  Mention,
  SystemNotification
}

class Communication {
  from: string;
  text: string;
  isNew: boolean;
  createdDate: Date;
  threadCount: number;
  communicationType: CommunicationType;
  fromId: string;
  voiceUrl: string;
  cssClass: string;
}

@Component({
  selector: 'app-communication-hub',
  templateUrl: './communication-hub.component.html',
  styleUrls: ['./communication-hub.component.css']
})
export class CommunicationHubComponent implements OnInit {

  communicationOpen = false;
  communications: Communication[];
  selectedCommunication: Communication;

  constructor() { }

  ngOnInit(): void {
    this.communications = [];
    this.communications.push({
      from: 'Greg Clement',
      text: 'This is a mention',
      isNew: false,
      createdDate: new Date(),
      threadCount: 1,
      communicationType: CommunicationType.Mention,
      fromId: '8e5c8b2f-845e-456f-a3d9-1ba9e4e75635',
      voiceUrl: null,
      cssClass: null,
    });
    this.communications.push({
      from: 'Scott Smith',
      text: '@Greg Clement, please look at the UX on the orders report. Something looks a little off. ',
      isNew: false,
      createdDate: new Date(),
      threadCount: 2,
      communicationType: CommunicationType.Email,
      fromId: '9c196c31-2c44-4000-af5a-096032940aa9',
      voiceUrl: null,
      cssClass: null,
    });
    this.communications.push({
      from: 'Scott Smith',
      text: 'Can we look at the possibility of making the orders report mobile friendly?',
      isNew: true,
      createdDate: new Date(),
      threadCount: 1,
      communicationType: CommunicationType.Email,
      fromId: '9c196c31-2c44-4000-af5a-096032940aa9',
      voiceUrl: null,
      cssClass: null,
    });
    this.communications.push({
      from: 'Scott Smith',
      text: 'Is the SMS Texting working yet?',
      isNew: true,
      createdDate: new Date(),
      threadCount: 1,
      communicationType: CommunicationType.Text,
      fromId: '9c196c31-2c44-4000-af5a-096032940aa9',
      voiceUrl: null,
      cssClass: null,
    });
    this.communications.push({
      from: 'Scott Hellewell',
      text: 'Voice Chat',
      isNew: false,
      createdDate: new Date(),
      threadCount: 1,
      communicationType: CommunicationType.VoiceChat,
      fromId: '1a69a01e-80e1-4de0-882b-654c005079b7',
      voiceUrl: null,
      cssClass: null,
    });
    this.communications.push({
      from: null,
      text: 'A new task has been assigned to you',
      isNew: false,
      createdDate: new Date(),
      threadCount: 1,
      communicationType: CommunicationType.SystemNotification,
      fromId: null,
      voiceUrl: null,
      cssClass: null,
    });
    for (const communication of this.communications) {
      this.setCssClass(communication);
    }
  }

  private setCssClass(communication: Communication) {
    switch (communication.communicationType) {
      case CommunicationType.Email:
        communication.cssClass = 'email';
        break;
      case CommunicationType.Mention:
        communication.cssClass = 'record_voice_over';
        break;
      case CommunicationType.Text:
        communication.cssClass = 'sms';
        break;
      case CommunicationType.Voice:
        communication.cssClass = 'phone';
        break;
      case CommunicationType.VoiceChat:
        communication.cssClass = 'voicemail';
        break;
      case CommunicationType.WebChat:
        communication.cssClass = 'chat_bubble_outline';
        break;
      case CommunicationType.SystemNotification:
        communication.cssClass = 'notifications_none';
        break;
    }
  }


}
