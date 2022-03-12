# angularx-sketch-and-text-editor (Work Under Progress so Code is not clean)
- Rich Text and Sketch Editor based on Angular 5.
- Allows user to create sketch using the tools provided.
- User can select single element(by clicking) or multiple elements(using Ctrl key).
- User can drag selected elements.

# Getting Started

### Prerequisites
- NodeJs - 8.11.3
- NPM - 5.6.0

NodeJs installation also installs NPM.
Download NodeJs from official website or from this direct link to website :-
> [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

### Installing
To setup project in development environment :-
- Take a clone of project using command on command line (CMD) :-
> `git clone https://github.com/PankajMSharma/angularx-sketch-and-text-editor.git`

- Go to root folder of project using command :-
> `cd angularx-sketch-and-text-editor`

- Install required packages using command :-
> `npm install`

- Install global setup using :-
> `ng setup`

- Build project using command :-
> `ng serve --open`

- Open browser and type url `localhost:4200/`

You are ready to play with project ;)

# Authors
Pankaj Sharma - https://www.linkedin.com/in/pankajmsharma/

# License
This project is licensed under the GNU General Public License v3.0 - see the LICENSE.md file for details


# Functionalities:
1. Only Rectangle, Square and Select work from header. Text box and Upload are future icons.
2. On load, Select is the default functionality.
3. Each new drawn object would come over the previous one. This creates a layered effect. Switching layers is not currently allowed.
4. Multiple objects can be selected by holding control key while selection.
5. Selected objects can be dragged from one place to another on canvas.
6. Resizing is work under progress. Hence, resizing is currently disabled.
7. Status bar in future would contain information. Currently it is static.
8. Drawing for touch is not supported yet. This important fucntionality would come in future.