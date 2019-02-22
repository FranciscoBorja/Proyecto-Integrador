import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicationService } from 'src/app/services/CRUD/publication.service';
import { Publication } from 'src/app/models/Publication';
import { Http } from '@angular/http';
import swal from 'sweetalert';
import { UserService } from 'src/app/services/CRUD/user.service';
import { User } from 'src/app/models/User';
import { Image } from 'src/app/models/Image';
import { Message } from 'src/app/models/Message';
import { ImageService } from 'src/app/services/CRUD/image.service';
import { FriendService } from 'src/app/services/CRUD/friend.service';
import { MessageService } from 'src/app/services/CRUD/message.service';

@Component({
  selector: 'app-muro',
  templateUrl: './muro.component.html',
  styleUrls: ['./muro.component.scss']
})
export class MuroComponent implements OnInit {
  content: String;
  @ViewChild('fileInput') fileInput;
  fecha: any;
  friendsGets: any = [];
  conversation: any[];
  nameFriends: any = [];
  mensaje: Message;
  listPublication: any = [];
  listImage: any = [];
  array = [];
  listUsers: any = [];
  user: User;
  image: Image;
  srcFoto = '';
  viewMesaje = false;
  userMesaje: User;
  idUserSend: any;
  imageReturned: any = [];
  isPicture = false;
  publication: Publication;
  x = JSON.parse(sessionStorage.getItem('user'));

  constructor(private publicationService: PublicationService, private userService: UserService,
    private http: Http, public router: Router, public authDataServise: AuthService,
    private imageService: ImageService, private friendService: FriendService, private messageServices: MessageService) {
    this.publication = new Publication;
    this.fecha = new Date();
    this.mensaje = new Message();
    this.image = new Image();
    this.getPublication();
    this.getImagePublicate();
    this.getMesajes();
  }

  ngOnInit() {
    this.getFriends();
    this.getName();
  }

  getUser(idUser?) {
    this.userService.get(idUser).then(response => {
      this.listUsers = response;
    }).catch(error => {
      console.log(error);
    });
  }

  publicar() {
    this.publication.content = this.content;
    this.publication.idUser = this.x.id;
    this.publication.date = this.fecha;

    this.publicationService.post(this.publication).then(r => {
      swal({
        title: 'Datos Guardados',
        text: 'Publicacion realizada satisfactoriamente.',
        icon: 'success',
      });
      this.content = '';
      this.getPublication();
    }).catch(e => {
      console.log(e);
    });
  }

  CodificarArchivo(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image.name = file.name;
        this.image.type = file.type;
        this.image.attached = reader.result.toString().split(',')[1];
        this.srcFoto = 'data:' + this.image.type + ';base64,' + this.image.attached;
      };
      this.isPicture = true;
    }
  }

  getPublication() {
    this.publicationService.get().then(response => {
      this.getUser(response.idUser);
      this.listPublication = response;
    }).catch(error => {
      console.log(error);
    });
  }

  getImagePublicate(image?) {
    if (image !== undefined) {
      this.listImage = [];
    }
    this.imageService.getPicturePublicate().then(r => {
      this.imageReturned = r;
      for (let i = 0; i < r.length; i++) {
        this.srcFoto = 'data:' + r[i].type + ';base64,' + r[i].attached;
        const data = { srcFoto: this.srcFoto, idUser: r[i].idUser };

        this.listImage.push(data);
      }
    }).catch(e => {

    });
  }

  publicarFoto() {
    this.image.idAlbum = 2;
    this.image.idUser = this.x.id;
    this.imageService.post(this.image).then(r => {
      this.srcFoto = 'data:' + r.type + ';base64,' + r.attached;
      swal({
        title: 'Foto Publicada con Exito',
        icon: 'success',
      });
      this.getImagePublicate(this.array);
      this.isPicture = false;
    }).catch(e => console.log(e));
  }

  getFriends() {
    this.friendService.get().then(r => {
      this.friendsGets = r;
    })
      .catch(e => {

      });
  }

  getName() {
    this.userService.get().then(r => {
      this.nameFriends = r;
    }).catch(e => {
      console.log('Error en traer nombres');
    });
  }

  openMesaje(id) {
    this.viewMesaje = true;
    this.userService.get(id).then(r => {
      this.userMesaje = r;
      this.getMesajes();
    }).catch(e => {

    });
  }

  getMesajes() {
    this.messageServices.get().then(r => {
      this.conversation = r;
    }).catch(e => {

    });

  }

  enviarMensaje() {
    this.idUserSend = JSON.parse(sessionStorage.getItem('user'));
    this.mensaje.idUser = this.idUserSend.id;
    this.mensaje.idFriend = this.userMesaje.id;
    this.mensaje.type = 'Text';
    this.messageServices.post(this.mensaje).then(r => {
      this.mensaje.content = '';
      this.getMesajes();
    }).catch(e => {

    });


  }

}
