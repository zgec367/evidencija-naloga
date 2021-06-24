import React, {useEffect, useState, useContext} from 'react';
import {View, FlatList, Text, Keyboard, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import firestore from '@react-native-firebase/firestore';
import {List, Modal, TextInput, Button} from 'react-native-paper';
import {Context} from '../Components/FirebaseProvider';
import * as Yup from 'yup';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fetchEmployees, login} from '../Redux/Employee/EmployeeActions';
function Login({employees, fetchEmployees, login}) {
  const [pickedEmployee, setPickedEmployee] = useState({});
  const [visible, setVisible] = useState(false);
  const [showPassword, setShow] = useState(false);
  const {user, setUser} = useContext(Context);
  const [search, setSearch] = useState('');

  const [connection, setConnection] = useState(true);

  const SignInSchema = Yup.object().shape({
    password: Yup.string().required('Ovo je polje obavezno'),
  });
  const containerStyle = {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '80%',
    height: 300,
    borderRadius: 15,
  };

  const pickEmployee = item => {
    setPickedEmployee(item);
    setVisible(true);
  };
  useEffect(() => {
    if (!employees.employees.lenght) {
      fetchEmployees();
    }
  }, []);
  return (
    <View
      style={{
        alignItems: 'center',
        height: '100%',
      }}>
      <Text
        style={{
          fontSize: 20,
          margin: 20,
          fontWeight: '600',
          color: '#072f3d',
        }}>
        Odaberite zaposlenika za prijavu
      </Text>
      <View style={{width: '70%'}}>
        <TextInput
          style={{backgroundColor: 'lightgrey', height: 50, borderRadius: 15}}
          placeholder="Pretraži zaposlenika"
          value={search}
          underlineColor="transparent"
          selectionColor="#87cefa"
          theme={{
            roundness: 15,
            colors: {
              primary: 'transparent',
            },
          }}
          onChangeText={text => setSearch(text)}
          left={<TextInput.Icon name="magnify" size={28} color="grey" />}
        />
      </View>

      {!employees.loadingData ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.Id}
          style={{
            width: '100%',
            marginTop: 20,
            backgroundColor: '#87cefa',
            zIndex: -1,
          }}
          data={employees.employees}
          renderItem={({item}) => (
            <View
              style={{
                height: 60,
                margin: 20,
                justifyContent: 'center',
                width: '80%',
                alignSelf: 'center',
                borderRadius: 10,
                backgroundColor: 'white',
              }}>
              <List.Item
                onPress={() => pickEmployee(item)}
                titleStyle={{
                  fontSize: 20,
                  color: '#072f3d',
                  alignSelf: 'center',
                }}
                title={item.Name}
              />
            </View>
          )}
        />
      ) : (
        <View>
          <Text style={{fontSize: 20, marginTop: 10}}>
            Ucitavanje zaposlenika...
          </Text>

          <ActivityIndicator
            style={{marginTop: 20}}
            size="large"
            color="#87cefa"
          />
        </View>
      )}
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={containerStyle}>
        <Text
          style={{
            bottom: 10,
            fontSize: 20,
            color: '#072f3d',
            textAlign: 'center',
          }}>
          {pickedEmployee.Name}
        </Text>
        <Formik
          validationSchema={SignInSchema}
          validateOnChange={false}
          initialValues={{email: pickedEmployee.Email, password: ''}}
          onSubmit={async (values, errors) => {
            Keyboard.dismiss();
            login(values.email, values.password);
          }}>
          {({handleChange, handleSubmit, handleBlur, values, errors}) => (
            <View>
              <TextInput
                editable={false}
                style={{marginTop: 10, backgroundColor: 'white'}}
                label="Email"
                placeholder="Email"
                value={values.email}
              />

              <TextInput
                label="Lozinka"
                style={{marginTop: 15, backgroundColor: 'white'}}
                secureTextEntry={showPassword ? false : true}
                placeholder="Lozinka"
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                value={values.password}
                right={
                  <TextInput.Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => {
                      setShow(!showPassword);
                    }}
                  />
                }
              />
              {errors.password && (
                <Text style={{color: 'red', marginLeft: 10}}>
                  {errors.password}
                </Text>
              )}

              <Button
                loading={employees.submitLoading}
                disabled={employees.submitLoading}
                style={{
                  marginTop: 20,
                  width: '50%',
                  alignSelf: 'center',
                }}
                uppercase={false}
                labelStyle={{
                  color: employees.submitLoading ? '#87cefa' : 'white',
                  fontSize: 20,
                }}
                mode="contained"
                onPress={handleSubmit}>
                Prijavi se
              </Button>
            </View>
          )}
        </Formik>
      </Modal>
    </View>
  );
}
const mapStateToProps = state => {
  return {
    employees: state.employeesData,
  };
};
const mapDispatchToProps = {
  fetchEmployees,
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
