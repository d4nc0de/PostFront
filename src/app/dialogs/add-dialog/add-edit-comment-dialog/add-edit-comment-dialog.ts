import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { User } from '@/Models/user.model';
import { post } from '@/Models/post.model';
import { CommonModule,  } from '@angular/common';
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

  userOptions: User[] = [];

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit(): void {
    const data = this.config.data as {
      mode?: Mode;
      comment?: comment | null;
      users?: User[] | null;
    } | undefined;

    if (data?.mode) this._mode.set(data.mode);
    if (Array.isArray(data?.users)) this.userOptions = data!.users!;

    if (data?.comment) {
      const clone: comment = JSON.parse(JSON.stringify(data.comment));

      switch(data.mode) {
        case 'create':
          // TODO: implementar autorizacion real
          clone.authorizedBy = clone.createdBy;
          break;

        case 'edit':
          clone.createdAt = new Date(clone.createdAt);

          /* TODO: manejar autorizacion real. quitar estos comentarios para desautorizar la nueva version del comentario(?)
          if(clone.authorizedBy) {
            clone.authorizedBy = null;
            clone.authorizedDate = null;
          } */
          break;
      }
      
      this._comment.set(clone);
    }
  }

  onCancel() {
    this.ref.close();
  }

  onSave() {
    this.submitted.set(true);

    const c = this.comment();
    if (!c.content || !c.createdBy) return;
    this.ref.close(c);
  }

  trackByCat = (_: number, val: string) => val;
}
