import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommentService } from '@/pages/service/comments.service';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { User } from '@/Models/user.model';
import { comment } from '@/Models/comments.model';
import { ToggleButtonModule } from 'primeng/togglebutton';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-add-edit-post-dialog',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    TextareaModule,
    RadioButtonModule,
    SelectModule,
    ButtonModule,
    CommonModule,
    ToggleButtonModule
  ],
  templateUrl: './add-edit-comment-dialog.html',
  styleUrls: ['./add-edit-comment-dialog.scss']
})
export class AddEditCommentDialog implements OnInit {
  private _mode = signal<Mode>('create');
  mode = computed(() => this._mode());

  private _comment = signal<comment>({
    idp: 0,
    id: 1,
    content: "",
    createdBy: { id: 0, userName: '', email: '', password: '' },
    createdAt: new Date(),
    liked: false,
    authorizedDate: new Date(), // TODO: hacer las opciones de autorizacion, cuando ya esté, cambiar a NULL
    authorizedBy: { id: 0, userName: '', email: '', password: '' } // TODO: LO MISMO DE ARRIBA
  });
  comment = computed(() => this._comment());

  submitted = signal(false);
  loading = signal(false);

  userOptions: User[] = [];
  postId: number = 0;

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const data = this.config.data as {
      mode?: Mode;
      comment?: comment | null;
      users?: User[] | null;
      postId?: number;
    } | undefined;

    if (data?.mode) this._mode.set(data.mode);
    if (Array.isArray(data?.users)) this.userOptions = data!.users!;
    if (data?.postId) {
      this.postId = data.postId;
      console.log('✅ PostId recibido en ngOnInit:', this.postId);
    } else {
      console.warn('⚠️ No se recibió postId en el config');
    }

    if (data?.comment) {
      const clone: comment = JSON.parse(JSON.stringify(data.comment));

      switch(data.mode) {
        case 'create':
          // Para crear, usar el postId del config (prioritario) o del comentario
          if (this.postId) {
            clone.idp = this.postId;
            console.log('✅ PostId establecido desde config en modo create:', this.postId);
          } else if (clone.idp) {
            console.log('✅ Usando PostId del comentario:', clone.idp);
          }
          // Autorizar automáticamente con el mismo usuario que crea
          clone.authorizedBy = clone.createdBy;
          clone.authorizedDate = new Date();
          break;

        case 'edit':
          clone.createdAt = new Date(clone.createdAt);
          // Preservar el idp del comentario original
          if (!clone.idp && this.postId) {
            clone.idp = this.postId;
            console.log('✅ PostId establecido desde config en modo edit:', this.postId);
          }
          // Al editar, desautorizar el comentario (requiere nueva autorización)
          clone.authorizedBy = null;
          clone.authorizedDate = null;
          break;
      }
      
      this._comment.set(clone);
    } else if (this.mode() === 'create') {
      // Si es creación nueva, inicializar con el postId
      if (this.postId) {
        const newComment: comment = {
          idp: this.postId,
          id: 0,
          content: "",
          createdBy: { id: 0, userName: '', email: '', password: '' },
          createdAt: new Date(),
          liked: false,
          authorizedDate: null,
          authorizedBy: null
        };
        this._comment.set(newComment);
        console.log('✅ Nuevo comentario inicializado con postId:', this.postId);
      } else {
        // Inicializar sin postId pero se establecerá en onSave
        const newComment: comment = {
          idp: 0,
          id: 0,
          content: "",
          createdBy: { id: 0, userName: '', email: '', password: '' },
          createdAt: new Date(),
          liked: false,
          authorizedDate: null,
          authorizedBy: null
        };
        this._comment.set(newComment);
        console.warn('⚠️ Nuevo comentario inicializado sin postId - se establecerá en onSave');
      }
    }
  }

  onCancel() {
    this.ref.close();
  }

  onSave() {
    this.submitted.set(true);

    let c = this.comment();
    
    // Validaciones básicas
    if (!c.content || !c.createdBy?.id) {
      console.error('❌ Validación fallida - content:', c.content, 'createdBy:', c.createdBy);
      return;
    }
    
    // Asegurar que tiene el postId - usar el del config como fallback
    if ((!c.idp || c.idp === 0) && this.postId) {
      c = { ...c, idp: this.postId };
      this._comment.set(c); // Actualizar el signal
      console.log('✅ PostId establecido desde config en onSave:', this.postId);
    } else if (c.idp && c.idp > 0) {
      console.log('✅ PostId ya existe en el comentario:', c.idp);
    }
    
    // Validar que finalmente tiene postId
    if (!c.idp || c.idp === 0) {
      alert('Error: No se puede crear el comentario sin un post asociado. Por favor, asegúrate de estar en una página de post válida.');
      console.error('❌ idp no válido después de todos los intentos:', c.idp);
      console.error('❌ postId del config:', this.postId);
      console.error('❌ Comentario completo:', c);
      return;
    }

    // Asegurar que tiene fecha de creación
    if (!c.createdAt) {
      c.createdAt = new Date();
    }

    // Para crear, si no hay authorizedBy, usar el mismo creador
    if (this.mode() === 'create' && !c.authorizedBy) {
      c.authorizedBy = c.createdBy;
      c.authorizedDate = new Date();
    }

    console.log('📤 Comentario a guardar:', c);
    console.log('📤 Validación - idp:', c.idp, 'idu:', c.createdBy.id, 'content:', c.content);
    console.log('📤 PostId del config:', this.postId);

    this.loading.set(true);

    if (this.mode() === 'create') {
      // Crear nuevo comentario
      this.commentService.createComment(c).subscribe({
        next: (createdComment) => {
          console.log('✅ Comentario creado exitosamente:', createdComment);
          this.loading.set(false);
          this.ref.close(createdComment);
        },
        error: (error) => {
          console.error('❌ Error al crear comentario:', error);
          this.loading.set(false);
          let errorMessage = 'Error al crear el comentario. Por favor, intenta de nuevo.';
          if (error.error) {
            errorMessage += `\n\nDetalles: ${typeof error.error === 'string' ? error.error : JSON.stringify(error.error)}`;
          }
          if (error.status) {
            errorMessage += `\n\nCódigo de error: ${error.status}`;
          }
          alert(errorMessage);
        }
      });
    } else {
      // Actualizar comentario existente
      this.commentService.updateComment(c).subscribe({
        next: (updatedComment) => {
          console.log('✅ Comentario actualizado exitosamente:', updatedComment);
          this.loading.set(false);
          this.ref.close(updatedComment);
        },
        error: (error) => {
          console.error('❌ Error al actualizar comentario:', error);
          this.loading.set(false);
          let errorMessage = 'Error al actualizar el comentario. Por favor, intenta de nuevo.';
          if (error.error) {
            errorMessage += `\n\nDetalles: ${typeof error.error === 'string' ? error.error : JSON.stringify(error.error)}`;
          }
          if (error.status) {
            errorMessage += `\n\nCódigo de error: ${error.status}`;
          }
          alert(errorMessage);
        }
      });
    }
  }

  trackByCat = (_: number, val: string) => val;
}
