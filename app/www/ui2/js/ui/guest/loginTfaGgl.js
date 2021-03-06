Scalr.regPage('Scalr.ui.guest.loginTfaGgl', function (loadParams, moduleParams, scalrParams) {
	if (moduleParams.authenticated) {
		Scalr.event.fireEvent('unlock');
		Scalr.event.fireEvent('redirect', '#/dashboard', true);
		return null;
	}

	if (! moduleParams.valid) {
		Scalr.message.Error('Two-factor authentication not enabled for this user');
		Scalr.event.fireEvent('redirect', '#/guest/login');
	}

	return Ext.create('Ext.form.Panel', {
		title: 'Two-factor authorization',
        bodyCls: 'x-container-fieldset x-fieldset-no-bottom-padding',
		width: 400,
		defaults: {
			anchor: '100%',
			labelWidth: 60
		},
		scalrOptions: {
			modal: true
		},
		items: [{
			xtype: 'textfield',
			fieldLabel: 'Code',
			name: 'tfaCode',
			allowBlank: false
		}],

		dockedItems: [{
			xtype: 'container',
			dock: 'bottom',
			cls: 'x-docked-buttons',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			items: [{
				xtype: 'button',
				text: 'Login',
				handler: function () {
					var me = this;
					if (this.up('form').getForm().isValid()) {
						Scalr.Request({
							processBox: {
								type: 'action'
							},
							form: this.up('form').getForm(),
							url: '/guest/xLoginTfaGgl',
							params: loadParams,
							success: function (data) {
								if (Scalr.user.userId && (data.userId == Scalr.user.userId)) {
									Scalr.state.userNeedLogin = false;
									Scalr.event.fireEvent('close', true);
									Scalr.event.fireEvent('unlock');
								} else {
									Scalr.event.fireEvent('redirect', '#/dashboard');
									Scalr.event.fireEvent('reload');
								}
							}
						})
					}
				}
			}, {
				xtype: 'button',
				text: 'Cancel',
				handler: function () {
					Scalr.event.fireEvent('close', true);
				}
			}]
		}]
	});
});
