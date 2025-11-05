import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PostService } from '@/pages/service/posts.service';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { User } from '@/Models/user.model';
import { post } from '@/Models/post.model';

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
    CommonModule
  ],
  templateUrl: './add-edit-post-dialog.html',
  styleUrls: ['./add-edit-post-dialog.scss']
})
export class AddEditPostDialog implements OnInit {
  private _mode = signal<Mode>('create');
  mode = computed(() => this._mode());

  private _post = signal<post>({
    id: 0,
    title: '',
    description: '',
    category: '',
    CreatedBy: { id: 0, userName: '', email: '', password: '' },
    comments: []
  });
  post = computed(() => this._post());

  submitted = signal(false);

  categories = ['Accessories', 'Clothing', 'Electronics', 'Fitness'];
  userOptions: User[] = [];
  loading = signal(false);

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const data = this.config.data as {
      mode?: Mode;
      post?: post | null;
      users?: User[] | null;
    } | undefined;

    if (data?.mode) this._mode.set(data.mode);
    if (Array.isArray(data?.users)) this.userOptions = data!.users!;

    if (data?.post) {
      const clone: post = JSON.parse(JSON.stringify(data.post));
      this._post.set(clone);
    }
  }

  onCancel() {
    this.ref.close();
  }

  onSave() {
    this.submitted.set(true);

    let p = this.post();
    
    // Validaciones básicas
    if (!p.title || !p.description || !p.category || !p.CreatedBy?.id) {
      console.error('❌ Validación fallida - campos faltantes:', {
        title: p.title,
        description: p.description,
        category: p.category,
        createdBy: p.CreatedBy
      });
      return;
    }
    
    // Limpiar y normalizar los datos antes de enviar
    const cleanedPost: post = {
      ...p,
      title: String(p.title || '').trim(),
      description: String(p.description || '').trim(),
      category: String(p.category || '').trim(),
      CreatedBy: p.CreatedBy // Mantener el objeto de usuario completo
    };
    
    // Validar que después de trim no estén vacíos
    if (!cleanedPost.title || !cleanedPost.description || !cleanedPost.category) {
      console.error('❌ Validación fallida - campos vacíos después de trim:', cleanedPost);
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
    
    // Validar que el usuario tenga un ID válido
    if (!cleanedPost.CreatedBy || !cleanedPost.CreatedBy.id || cleanedPost.CreatedBy.id === 0) {
      console.error('❌ Validación fallida - usuario inválido:', cleanedPost.CreatedBy);
      alert('Por favor, selecciona un autor válido.');
      return;
    }
    
    // Actualizar el signal con los datos limpios
    this._post.set(cleanedPost);
    
    console.log('📤 Post original:', p);
    console.log('📤 Post a guardar (después de limpieza):', cleanedPost);

    this.loading.set(true);

    if (this.mode() === 'create') {
      // Crear nuevo post (usar el post limpio del signal)
      const postToSave = this.post();
      this.postService.createPost(postToSave).subscribe({
        next: (createdPost) => {
          console.log('✅ Post creado exitosamente:', createdPost);
          this.loading.set(false);
          this.ref.close(createdPost);
        },
        error: (error) => {
          console.error('❌ Error al crear post:', error);
          this.loading.set(false);
          let errorMessage = 'Error al crear el post. Por favor, intenta de nuevo.';
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
      // Actualizar post existente (usar el post limpio del signal)
      const postToSave = this.post();
      this.postService.updatePost(postToSave).subscribe({
        next: (updatedPost) => {
          console.log('✅ Post actualizado exitosamente:', updatedPost);
          this.loading.set(false);
          this.ref.close(updatedPost);
        },
        error: (error) => {
          console.error('❌ Error al actualizar post:', error);
          this.loading.set(false);
          let errorMessage = 'Error al actualizar el post. Por favor, intenta de nuevo.';
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
