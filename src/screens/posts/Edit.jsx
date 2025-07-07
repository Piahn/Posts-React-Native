import {
  View,
  Text,
  TextInput,
  Button,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import api from '../../services/api';
import styles from '../../styles';
import {handleErrors} from '../../utils/handleErrors';

export default function PostEdit({route, navigation}) {
  // Get Id from params
  const {id} = route.params;

  // State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState([]);

  const fetchDetailPost = async () => {
    await api.get(`/api/posts/${id}`).then(response => {
      setTitle(response.data.data.title);
      setContent(response.data.data.content);
    });
  };

  useEffect(() => {
    fetchDetailPost();
  });

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response) {
        setImage(response);
      }
    });
  };

  // method updatePost
  const updatePost = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (image && image.assets && image.assets[0]) {
      formData.append('image', {
        uri: image.assets[0].uri,
        type: image.assets[0].type,
        name: image.assets[0].fileName,
      });
    }

    try {
      await api
        .put(`/api/posts/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          ToastAndroid.show('Post Updated Successfully!', ToastAndroid.LONG);

          navigation.push('PostIndex');
        });
    } catch (error) {
      handleErrors(error.response.data, setErrors);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.upload}>
          <Button
            title="Choose Image"
            color="gray"
            onPress={handleChoosePhoto}
          />
        </View>
        {errors?.image && <Text style={styles.error}>{errors?.image}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Title"
          defaultValue={title}
          onChangeText={value => setTitle(value)}
        />
        {errors?.title && <Text style={styles.error}>{errors?.title}</Text>}
        <TextInput
          style={styles.textarea}
          placeholder="Content"
          defaultValue={content}
          onChangeText={value => setContent(value)}
        />
        {errors?.content && <Text style={styles.error}>{errors?.content}</Text>}
        <View style={styles.activityIndicator}>
          <TouchableOpacity style={styles.button} onPress={updatePost}>
            <Text style={styles.buttonText}>UPDATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
