import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType } from '../../ui/custom-toastr.service';
import { ToastPosition } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(private httpClientService: HttpClientService, private alertify: AlertifyService, private customToastrService: CustomToastrService,
    private dialog: MatDialog, private dialogService: DialogService){}

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }

    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({"responseType": "blob"})
        }, fileData).subscribe(data => {
          const message: string = "Dosyalar başarıyla yüklenmiştir!";
    
          if (this.options.isAdminPage) {
            this.alertify.message(message, {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopCenter
            })
          }else{
            this.customToastrService.message(message, "Başarılı", {
              messageType: ToastrMessageType.Success,
              position: ToastPosition.TopCenter
            })
          }
        }, (errorResponse: HttpErrorResponse) => {
          const message: string = "Dosyalar başarıyla yüklenememiştir!";
    
          if (this.options.isAdminPage) {
            this.alertify.message(message, {
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopCenter
            })
          }else{
            this.customToastrService.message(message, "Başarısız", {
              messageType: ToastrMessageType.Error,
              position: ToastPosition.TopCenter
            })
          }
        });
      }
    })
  }

  openDialog(afterClosed: any): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, {
      width: '250px',
      data: FileUploadDeleteState.Yes,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == FileUploadDeleteState.Yes) {
        afterClosed();
      }
    });
  }
}

export class FileUploadOptions{
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}

export enum FileUploadDeleteState {
  Yes,
  No
}