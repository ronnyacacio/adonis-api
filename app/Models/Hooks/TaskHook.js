'use strict';

const Mail = use('Mail');
const Helpers = use('Helpers');

const TaskHook = (exports = module.exports = {});

TaskHook.sendNewTaskMail = async (taskInstance) => {
  if (!taskInstance.user_id && taskInstance.dirty.user_id) return;

  const { email, username } = await taskInstance.user().fetch();
  const file = await taskInstance.file().fetch();

  const { title } = taskInstance;

  await Mail.send(
    ['emails.new_task'],
    {
      username,
      title,
      hasAttachment: !!file,
    },
    (message) => {
      message
        .to(email)
        .from('adonis@adonis.com', 'Adonis')
        .subject('Nova tarefa pra você');

      if (file)
        message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          filename: file.name,
        });
    }
  );
};
