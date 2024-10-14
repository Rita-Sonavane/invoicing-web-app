import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {


  isLoginMode = true;
  registerForm: FormGroup | any;
  loginForm: FormGroup | any;
  forgetPasswordForm: FormGroup | any;
  showForgetPasswordForm: boolean = false;
  currentUser: any;
  isPasswordVisible = false;
  isconfirmPasswordVisible = false;
  currentFormMode: 'login' | 'register' | 'forgotPassword' = 'login';


  token: string = '';
  newPassword: string = '';
  message: string = '';


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private profileService: ProfileService, private route: ActivatedRoute, private store: Store<{ currentClinet: any }>) { }

  ngOnInit(): void {

    const token = this.authService.getToken();
    const user = this.authService.getCurrentUser();

    if (token && user) {
      console.log("From App Component:", { token, user });
      this.router.navigate(['/dashboard']);
    } else {
      console.log("No token or user found in localStorage");
    }



    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required]
    }, { validator: this.mustMatch('password', 'confirmpassword') });


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // rememberMe: [false]
    });

    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmpassword: ['', Validators.required]
    }, { validator: this.mustMatch('password', 'confirmpassword') });

    // this.token = this.route.snapshot.queryParamMap.get('token');

  }

  changeFormMode(mode: 'login' | 'register' | 'forgotPassword') {
    this.currentFormMode = mode;
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onRegistersubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    console.log(this.registerForm.value);
    this.authService.signUp(this.registerForm.value).subscribe(
      (response) => {
        console.log('Sign up successful', response);

        Swal.fire({
          title: 'Success',
          text: 'You have signed up successfully',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          this.resetForm();
          this.changeFormMode('login');
        });

        const profileData = {
          name: response.result.name,
          email: response.result.email,
          userId: response.result._id
        };
        this.createProfile(profileData);
      },
      (error) => {
        console.log(error);

        let title = 'Error';
        let text = 'Something went wrong. Please try again later.';

        if (error.status === 409 && error.error.message === 'Email already exists') {
          text = 'The email address is already in use. Please use a different email.';
        }

        Swal.fire({
          title: title,
          text: text,
          icon: 'error',
          timer: 1000, // Automatically close after 2 seconds
          showConfirmButton: false // Hide the confirm button
        });
      }
    );
  }



  private createProfile(profileData: any): void {
    this.profileService.createProfile(profileData).subscribe(
      (profileResponse) => {
        console.log('Profile created successfully', profileResponse);
      },
      (error) => {
        console.log('Error creating profile', error);
        if (error.status === 409) {
          Swal.fire('Conflict', 'Profile already exists', 'warning');
        } else {
          Swal.fire('Error', error.message, 'error');
        }
      }
    );
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    if (this.loginForm.valid) {
      console.log("Submitting form with values", this.loginForm.value);

      this.authService.signIn(this.loginForm.value).subscribe(
        (response) => {
          console.log('Sign in successful', response);

          Swal.fire({
            title: 'Success',
            text: 'Login successful',
            icon: 'success',
            timer: 1000, // Automatically close after 2 seconds
            showConfirmButton: false // Hide the confirm button
          }).then(() => {
            this.authService.storeTokenAndUser(response);
            this.router.navigate(['/dashboard']);
          });
        },
        (error) => {
          console.log(error);

          let title = 'Error';
          let text = 'Something went wrong. Please try again later.';

          if (error.status === 401 && error.error.message === 'Invalid credentials') {
            text = 'Invalid email or password. Please try again.';
          } else if (error.status === 404 && error.error.message === 'User not found') {
            text = 'No account found with this email. Please check your email and try again.';
          }

          Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      );
    }
  }




  toggleMode(isLogin: boolean): void {
    this.isLoginMode = isLogin;
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  confirmtogglePasswordVisibility() {
    this.isconfirmPasswordVisible = !this.isconfirmPasswordVisible;
  }

  resetForm(): void {
    this.registerForm.reset();
    this.loginForm.reset();
  }


  ngAfterViewInit() {
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', () => {
        const passwordInput = button.previousElementSibling as HTMLInputElement;
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          button.classList.add('show');
        } else {
          passwordInput.type = 'password';
          button.classList.remove('show');
        }
      });
    });


    const confiremtogglePasswordButtons = document.querySelectorAll('.confirmtoggle-password');
    confiremtogglePasswordButtons.forEach(button => {
      button.addEventListener('click', () => {
        const passwordInput = button.previousElementSibling as HTMLInputElement;
        console.log("passwordInput", passwordInput);
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          button.classList.add('show');
        } else {
          passwordInput.type = 'password';
          button.classList.remove('show');
        }
      });
    });



  }




  onForgotPassword(): void {
    if (this.forgetPasswordForm.valid) {
      const email = this.forgetPasswordForm.get('email')?.value;
      const password = this.forgetPasswordForm.get('password')?.value;
      const confirmpassword = this.forgetPasswordForm.get('confirmpassword')?.value;

      this.authService.resetPassword(email, password, confirmpassword).subscribe(
        response => {
          console.log('Password reset successful:', response);

          Swal.fire({
            title: 'Success',
            text: 'Password reset successful.',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          }).then(() => {

            this.changeFormMode('login');
          });
        },
        error => {
          let errorMessage = 'An error occurred. Please try again.';
          if (error.status === 400) {
            errorMessage = 'Invalid email or password.';
          } else if (error.status === 404) {
            errorMessage = 'User not found.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }

          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });

          console.error('Error resetting password:', error);
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all required fields correctly.',
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }




  mustMatch(password: string, confirmPassword: string): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']) {
        // return if another validator has already found an error on the confirmPasswordControl
        return null;
      }

      // set error on confirmPasswordControl if validation fails
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }

      return null;
    };
  }


}