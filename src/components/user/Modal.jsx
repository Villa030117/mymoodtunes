import React from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Modal = ({ visible, onClose, title, content, buttons }) => {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
          
          <ScrollView style={styles.contentContainer}>
            {typeof content === 'string' ? (
              <Text style={styles.contentText}>{content}</Text>
            ) : (
              content
            )}
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            {buttons && buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.primary ? styles.primaryButton : styles.secondaryButton,
                  button.disabled ? styles.disabledButton : null
                ]}
                onPress={button.onPress}
                disabled={button.disabled}
              >
                <Text 
                  style={[
                    styles.buttonText, 
                    button.primary ? styles.primaryButtonText : styles.secondaryButtonText,
                    button.disabled ? styles.disabledButtonText : null
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    padding: 15,
    maxHeight: 400,
  },
  contentText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#4dabf7',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#444',
  },
  disabledButtonText: {
    color: '#888',
  },
});

export default Modal;
