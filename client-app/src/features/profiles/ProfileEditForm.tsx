import MyTextArea from 'app/common/form/MyTextArea';
import MyTextInput from 'app/common/form/MyTextInput';
import { useStore } from 'app/stores/store';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';

interface Props {
  setEditMode: (editMode: boolean) => void;
}

const ProfileEditForm: React.FC<Props> = ({ setEditMode }) => {
  const {
    profileStore: { profile, updateProfile },
  } = useStore();
  return (
    <Formik
      initialValues={{
        displayName: profile?.displayName,
        bio: profile?.bio,
      }}
      onSubmit={(values) => {
        updateProfile(values).then(() => {
          setEditMode(false);
        });
      }}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
      })}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="ui form">
          <MyTextInput placeholder="Display Name" name="displayName" />
          <MyTextArea rows={3} placeholder="Add your bio" name="bio" />
          <Button
            positive
            type="submit"
            loading={isSubmitting}
            content="Update Profile"
            floated="right"
            disabled={!isValid || !dirty}
          />
        </Form>
      )}
    </Formik>
  );
};

export default observer(ProfileEditForm);
