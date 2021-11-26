import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import * as googleTTS from 'google-tts-api';
import {Howl} from 'howler';


export default class Card extends React.Component{

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        let url = googleTTS.getAudioUrl(this.props.value, {
            lang: 'fr-FR',
            slow: false,
            host: 'https://translate.google.com',
          });

        this.sound = new Howl({
            src: [url],
            format: ['mp3']
        });

        this.sound.once('load', function(){
            this.sound.play();
          });          

    }

    handleClick(e) {
        console.log(this.sound);
        this.sound.play();
    }

    render (){
        return (
            <Draggable
                //key={this.props.id}
                draggableId={this.props.id}
                index={this.props.index}
            >
                {provided => (
                    <div
                    className="card"
                    onClick={this.handleClick}
                    ref={provided.innerRef}
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps}
                    >
                        <h3>{this.props.value}</h3>
                    </div>
                )}
            </Draggable>
            
        )
    }
}
