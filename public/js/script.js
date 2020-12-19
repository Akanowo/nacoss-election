// jshint esversion:8
if (window.location.pathname === '/auth/login' || window.location.pathname === '/auth/login/') {
  const loginForm = document.getElementById('loginForm');
  const matricNumber = document.querySelector("#matric");
  const password = document.querySelector("#password");
  const matricNumberError = document.querySelector(
    ".matric-number-error-message"
  );
  const passwordError = document.querySelector(".password-error-message");

  const btnSubmit = document.querySelector(".btn-submit");

  matricNumber.addEventListener("keypress", (e) => {
    if (matricNumber.value.length > 8) {
      e.preventDefault();
      password.focus();
    }
  });

  btnSubmit.addEventListener("click", (e) => {
    // matric number validation
    if (!matricNumber.value.length) {
      // EMPTY CASE
      matricNumberError.innerText = "matric number is required";
      matricNumberError.classList.add("error-message");
      e.preventDefault();
    } else if (matricNumber.value.length < 9) {
      // LESS THAN 9 CHARACTERS
      matricNumberError.innerText =
        "matric number must not be less than 9 characters";
      matricNumberError.classList.add("error-message");
      e.preventDefault();
    } else {
      matricNumberError.innerText = "";
    }

    // password validation
    if (!password.value.length) {
      passwordError.innerText = "password is required";
      passwordError.classList.add("error-message");
      e.preventDefault();
    } else {
      passwordError.innerText = "";
    }
  });

  loginForm.onsubmit = (ev) => {
    ev.preventDefault();
    $.ajax({
      url: '/auth/login',
      method: 'POST',
      data: { username: matricNumber.value, password: password.value, claim: 'user' },
      success: (response) => {
        if (response.status === 'failed' && response.error.message === 'User has voted already') {
          return Swal.fire({
            icon: 'error',
            title: response.status.toLocaleUpperCase(),
            text: 'Sorry you cannot vote twice'
          });
        }
        if (response.status === 'failed') {
          return Swal.fire({
            icon: 'error',
            title: response.status,
            text: response.info.message
          });
        }

        if (response.status === 'success') {
          return Swal.fire({
            icon: 'success',
            title: response.status,
            text: response.info.message
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              if (response.isFirstLogin) {
                (async function changePassword() {
                  return Swal.fire({
                    title: 'Change Password',
                    html:
                      '<input type="password" autocomplete="off" id="swal-input1" placeholder="Old Password" class="swal2-input">' +
                      '<input type="password" autocomplete="off" id="swal-input2" placeholder="New Password" class="swal2-input">' +
                      '<input type="password" autocomplete="off" id="swal-input3" placeholder="Confirm new Password" class="swal2-input"><br><small><b>Password must incluse at least one capital letter, number and special character eg $@,.</b></small>',
                    focusConfirm: false,
                    preConfirm: () => {
                      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;
                      const oldPwd = document.getElementById('swal-input1').value;
                      const newPwd = document.getElementById('swal-input2').value;
                      const confirmPwd = document.getElementById('swal-input3').value;

                      if (oldPwd.trim() !== response.password) {
                        return Swal.showValidationMessage('Incorrect previous password');
                      }

                      if (!strongPasswordRegex.test(newPwd)) {
                        return Swal.showValidationMessage('Password criteria not met');
                      }

                      if (newPwd.trim() !== confirmPwd.trim()) {
                        return Swal.showValidationMessage('Passwords do not match');
                      }
                      return $.ajax({
                        url: '/auth/change-pwd',
                        method: 'POST',
                        data: { user: matricNumber.value, password: confirmPwd },
                        success: (res) => {
                          if (res.status === 'success') {
                            Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'Password reset successful'
                            }).then((ok) => {
                              if (ok.isConfirmed || ok.isDismissed) {
                                window.location.href = '/vote';
                              }
                            });
                          }
                        },
                        error: (err) => {
                          if (err.status === 'failed') {
                            Swal.fire({
                              icon: 'failed',
                              title: 'Error',
                              text: err.message
                            });
                          }
                        }
                      });
                    }
                  });
                }());
              } else {
                window.location.href = '/vote';
              }
            }
          });
        }
      },
      error: (err) => {
        if (err.status === 400 || err.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Incorrect username or password'
          });
          password.value = null;
        }
      }
    });
  };
}



if (window.location.pathname === '/vote' || window.location.pathname === '/vote/') {
  const positionsLength = document.getElementsByClassName('accordion__item');

  const candidates = [];
  const summary = [];
  const voteForm = $('#voteForm');
  voteForm.parsley();

  const voteBtns = document.getElementsByClassName('vote-btn');

  for (let btn of voteBtns) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const candidate = candidates.find((candidate) => candidate.post === btn.id);
      const sum = summary.find((summ) => summ.candidatePosition === btn.id);
      if (candidate || sum) {
        if (candidate.id === btn.value && sum.candidateName === btn.name) {
          Swal.fire({
            icon: 'info',
            text: 'You already voted this person'
          });
          toastr.error('You cannot vote the same candidate twice');
        } else {
          const index = candidates.indexOf(candidate);
          const summaryIndex = summary.indexOf(sum);
          if (index > -1) {
            candidates.splice(index, 1);
          }
          if (summaryIndex > -1) {
            summary.splice(summaryIndex, 1);
          }
          candidates.push({ name: btn.name, id: btn.value, post: btn.id });
          toastr.info(`You voted ${btn.name} as ${btn.id}`);
          summary.push({
            candidateName: btn.name,
            candidatePosition: btn.id
          });
        }
      } else {
        toastr.info(`You voted ${btn.name} as ${btn.id}`);
        candidates.push({ name: btn.name, id: btn.value, post: btn.id });
        summary.push({
          candidateName: btn.name,
          candidatePosition: btn.id
        });
      }
    });
  }

  voteForm.on('submit', (e) => {
    let html = document.createElement('div');
    summary.forEach((sum) => {
      const p = document.createElement('p');
      p.innerText = `You voted ${sum.candidateName} as ${sum.candidatePosition}`;
      html.appendChild(p);
    });
    e.preventDefault();
    if (candidates.length != positionsLength.length) {
      Swal.fire({
        icon: 'error',
        text: 'All candidates must be voted for'
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Summary',
        html,
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: '/vote',
            method: 'POST',
            data: { candidates },
            success: (response) => {
              if (response.status === 'session-timeout') {
                Swal.fire({
                  icon: 'error',
                  title: 'Session Expired',
                  text: response.message
                }).then((res) => {
                  if (res.isConfirmed || result.isDismissed) {
                    window.location.href = '/auth/login';
                  }
                });
              }
              if (response.status === 'success') {
                Swal.fire({
                  icon: 'success',
                  title: 'Vote Successful',
                  text: 'Your vote has been uploaded successfully'
                }).then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    $.ajax({
                      url: '/auth/logout',
                      method: 'GET',
                      success: (response) => {
                        if (response.status === 'logged out') {
                          window.location.href = '/auth/login';
                        }
                      }
                    });
                  }
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: response.message
                }).then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    window.location.href = '/auth/login';
                  }
                });
              }
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message
              });
            }
          });
        }
      });
    }
  });
}

if (window.location.pathname === '/auth/login/admin' || window.location.pathname === '/auth/login/admin/') {
  const email = $('#email');
  const password = $('#password');
  const loginForm = $('#loginForm');
  loginForm.parsley();
  loginForm.on('submit', (e) => {
    e.preventDefault();
    $.ajax({
      url: '/auth/login',
      method: 'POST',
      data: { username: email.val().trim(), password: password.val().trim(), claim: 'admin' },
      success: (response) => {
        if (response.status === 'failed') {
          return Swal.fire({
            icon: 'error',
            title: response.status,
            text: response.info ? response.info.message : response.error.message
          });
        }

        if (response.status === 'success') {
          return Swal.fire({
            icon: response.status,
            title: response.status,
            text: response.info.message
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              window.location.href = '/admin';
            }
          });
        }
      },
      error: (err) => {
        if (err.status === 400 || err.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Incorrect username or password'
          });
          password.val(null);
        }
      }
    });
  });
}

if (window.location.pathname === '/admin/create-position' || window.location.pathname === '/admin/create-position/') {
  const position = $('#position');
  const position_desc = $('#position-desc');
  const createForm = $('#createForm');
  createForm.parsley();

  createForm.on('submit', (e) => {
    e.preventDefault();
    $.ajax({
      url: '/admin/create-position',
      method: 'POST',
      data: { position: position.val().trim(), position_desc: position_desc.val().trim() },
      success: (response) => {
        if (response.status === 'success') {
          position.val(null);
          position_desc.val(null);
          Swal.fire({
            icon: response.status,
            title: response.status.toLocaleUpperCase(),
            text: response.message
          });
        }

        if (response.status === 'failed') {
          Swal.fire({
            icon: 'error',
            title: response.status.toLocaleUpperCase(),
            text: response.message
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: error.responseJSON.status.toLocaleUpperCase(),
          text: error.responseJSON.message
        });
      }
    });
  });
}

if (window.location.pathname === '/admin/register-candidate' || window.location.pathname === '/admin/register-candidate/') {
  const matNo = $('#matNo');
  const registerForm = $('#registerForm');
  registerForm.parsley();
  let image = '';

  const uploadImgBtn = document.getElementById('uploadImgBtn');

  uploadImgBtn.onclick = () => {
    const formData = new FormData();
    Swal.fire({
      title: 'Upload Image',
      input: 'file',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Upload',
      showLoaderOnConfirm: true,
      preConfirm: (imgUrl) => {
        try {
          formData.append('image', imgUrl);
          return axios.post('/admin/upload-image', formData)
            .then((response) => {
              if(response.data.status === 'failed') {
                return Swal.fire({
                  icon: 'error',
                  title: response.data.status.toLocaleUpperCase(),
                  text: response.data.message
                });
              }
              image = response.data;
              return response;
            })
            .catch((error) => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              );
            });
        } catch (er) {
          const message = 'Check your internet connection and refresh';
          return Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: message
          });
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        const message = 'Image uploaded successfully!';
        return Swal.fire({
          icon: 'success',
          title: 'Success',
          text: message
        });
      }
    });
  };

  registerForm.on('submit', (e) => {
    e.preventDefault();
    $.ajax({
      url: '/admin/register-candidate',
      method: 'POST',
      data: { matNo: matNo.val().trim(), image },
      success: (response) => {
        if (response.status === 'success') {
          matNo.val(null);
          Swal.fire({
            icon: response.status,
            title: response.status.toLocaleUpperCase(),
            text: response.message
          });
        }

        if (response.status === 'failed') {
          Swal.fire({
            icon: 'error',
            title: response.status.toLocaleUpperCase(),
            text: response.message
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: error.responseJSON.status.toLocaleUpperCase(),
          text: error.responseJSON.message
        });
      }
    });
  });
}

if (window.location.pathname === '/admin/map-candidates' || window.location.pathname === '/admin/map-candidates/') {
  const candidate = $('#candidate');
  const position = $('#position');
  const registerForm = $('#registerForm');
  registerForm.parsley();
  registerForm.on('submit', (e) => {
    e.preventDefault();
    $.ajax({
      url: '/admin/map-candidates',
      method: 'POST',
      data: { candidateId: candidate.val().trim(), positionId: position.val().trim() },
      success: (response) => {
        if (response.status === 'success') {
          Swal.fire({
            icon: response.status,
            title: response.status.toLocaleUpperCase(),
            text: response.message
          });
        }

        if (response.status === 'failed') {
          Swal.fire({
            icon: 'error',
            title: response.status.toLocaleUpperCase(),
            text: response.message
          });
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: error.responseJSON.status.toLocaleUpperCase(),
          text: error.responseJSON.message
        });
      }
    });
  });
}

if(window.location.pathname.includes('/admin')) {
  const changePwdLink = document.getElementById('changePwdBtn');
  changePwdLink.onclick = (e) => {
    e.preventDefault();
    (async function changePassword() {
      const adminInfo = await axios.get('/admin/change-pwd');
      if(adminInfo.data.status === 'success') {
        return Swal.fire({
          title: 'Change Password',
          html:
            '<input type="password" autocomplete="off" id="swal-input1" placeholder="Old Password" class="swal2-input">' +
            '<input type="password" autocomplete="off" id="swal-input2" placeholder="New Password" class="swal2-input">' +
            '<input type="password" autocomplete="off" id="swal-input3" placeholder="Confirm new Password" class="swal2-input"><br><small><b>Password must incluse at least one capital letter, number and special character eg $@,.</b></small>',
          focusConfirm: false,
          preConfirm: () => {
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;
            const oldPwd = document.getElementById('swal-input1').value;
            const newPwd = document.getElementById('swal-input2').value;
            const confirmPwd = document.getElementById('swal-input3').value;
  
            if (oldPwd.trim() !== adminInfo.data.admin.password) {
              return Swal.showValidationMessage('Incorrect previous password');
            }
  
            if (!strongPasswordRegex.test(newPwd)) {
              return Swal.showValidationMessage('Password criteria not met');
            }
  
            if (newPwd.trim() !== confirmPwd.trim()) {
              return Swal.showValidationMessage('Passwords do not match');
            }
            return $.ajax({
              url: '/admin/change-pwd',
              method: 'POST',
              data: { user: adminInfo.data.admin._id, password: confirmPwd },
              success: (res) => {
                if (res.status === 'success') {
                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Password reset successful'
                  });
                }

                if (res.status === 'failed') {
                  Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: res.message
                  });
                }
              },
              error: (err) => {
                if (err.status === 'failed') {
                  Swal.fire({
                    icon: 'failed',
                    title: 'Error',
                    text: err.message
                  });
                }
              }
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: adminInfo.data.message
        });
      }
    }());
  };

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.onclick = (ev) => {
    ev.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then(async (result) => {
      if(result.isConfirmed) {
        const logoutResponse = await axios.get('/admin/logout');
        if(logoutResponse.data.status === 'logged out') {
          window.location.href = '/auth/login/admin';
        }
      }
    });
  };

  const pdfBtn = $('#pdf-btn');
  const excelBtn = $('#csv-btn');
  const fileName = $('#fileName');

  pdfBtn.on('click', (e) => {
    e.preventDefault();
    $('#dataTable').tableHTMLExport({
      type: 'pdf',
      filename: `${fileName.text()}.pdf`,
    });
  });

  excelBtn.on('click', (e) => {
    e.preventDefault();
    $('#dataTable').tableHTMLExport({
      type: 'csv',
      filename: `${fileName.text()}.csv`,
      // for csv
      separator: ',',
      newline: '\r\n',
      trimContent: true,
      quoteFields: true,

    });
  });
}

if(window.location.pathname === '/admin/generate-passwords' || window.location.href === '/admin/generate-passwords/') {
  const genBtn = document.getElementById('generateBtn');
  genBtn.onclick = async (ev) => {
    ev.preventDefault();
    const users = await axios.get('/admin/generate-passwords/generate');
    if(users.data.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: users.data.message
      }).then((result) => {
        if(result.isConfirmed || result.isDismissed) {
          window.location.reload();
        }
      });
    }
  };
}
