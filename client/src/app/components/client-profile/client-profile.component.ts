import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css']
})
export class ClientProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;
  profile: any;
  isEditMode = false;
  editProfileId: string | null = null;
  showForm = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+\d{10,}$/)]],
      mobileNumber: ['', [Validators.pattern(/^\+\d{10,}$/)]],
      businessName: ['', Validators.required],
      contactAddress: ['', Validators.required],
      logo: ['', Validators.required],
      website: ['', Validators.required],
      fax: ['', [Validators.pattern(/^\+?\d{7,}$/)]],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;

      this.fetchProfile(this.currentUser._id);

      console.log("Current User", this.currentUser);
    });

  }



  fetchProfile(id: string): void {
    this.profileService.getProfile(id).subscribe(
      data => {
        this.profile = data;
        console.log('Profile:', this.profile);
      },
      error => {
        console.error('Error fetching profile:', error);
      }
    );
  }


  onSubmit(): void {
    // if (this.profileForm.invalid) return;

    const profileData = this.profileForm.value;
    profileData.userId = this.currentUser._id;

    console.log("Inside submit", this.editProfileId, profileData);

    if (this.isEditMode && this.editProfileId) {
      // Edit profile mode
      this.profileService.updateProfile(this.editProfileId, profileData).subscribe(
        (response) => {
          this.profile = response;
          console.log('Profile updated:', response);
          Swal.fire({
            title: 'Success',
            text: 'Profile updated successfully',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          }).then(() => {
            this.resetForm();
          });
        },
        error => {
          console.error('Error updating profile:', error);
          Swal.fire({
            title: 'Error',
            text: 'Error updating profile. Please try again later.',
            icon: 'error',
            timer: 2000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          });
        }
      );
    } else {
      // Create profile mode
      this.profileService.createProfile(profileData).subscribe(
        response => {
          console.log('Profile created:', response);
          Swal.fire({
            title: 'Success',
            text: 'Profile created successfully',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          }).then(() => {
            this.resetForm();
          });
        },
        error => {
          console.error('Error creating profile:', error);
          Swal.fire({
            title: 'Error',
            text: 'Error creating profile. Please try again later.',
            icon: 'error',
            timer: 2000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          });
        }
      );
    }
  }


  onEditProfile(profile: any): void {
    console.log("profile", profile);
    this.isEditMode = true;
    this.editProfileId = profile._id;
    this.profileForm.patchValue(profile);
    this.showForm = true;
  }

  onBack() {
    this.showForm = false;
  }

  onDeleteProfile(profileId: string): void {
    if (confirm('Are you sure you want to delete this profile?')) {
      this.profileService.deleteProfile(profileId).subscribe(
        response => {
          console.log('Profile deleted:', response);
        },
        error => {
          console.error('Error deleting profile:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.editProfileId = null;
    this.profileForm.reset();
    this.showForm = false; // Hide the form after submission
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileForm.patchValue({
        image: file
      });
    }
  }
}