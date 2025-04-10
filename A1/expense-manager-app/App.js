import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For navigation icons

const TransactionsScreen = () => {
  const transactions = [
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/34/paypal-1296535_1280.png', // Placeholder for PayPal logo
      name: 'PayPal',
      date: 'Today',
      amount: '+ $500',
      color: '#4CAF50', // Green for positive amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2017/03/16/21/18/mastercard-2150188_1280.png', // Placeholder for Mastercard logo
      name: 'Mastercard',
      date: 'Today',
      amount: '- $693',
      color: '#F44336', // Red for negative amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/visa-1296544_1280.png', // Placeholder for Visa logo
      name: 'Visa',
      date: '1 Mar 2021',
      amount: '- $200',
      color: '#F44336', // Red for negative amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/axcess-1296545_1280.png', // Placeholder for Axcess logo (generic bank logo)
      name: 'Axcess',
      date: '23 Mar 2021',
      amount: '- $50',
      color: '#F44336', // Red for negative amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/american-express-1296546_1280.png', // Placeholder for Amex logo
      name: 'Amex',
      date: '1 Apr 2021',
      amount: '+ $60',
      color: '#4CAF50', // Green for positive amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/skrill-1296547_1280.png', // Placeholder for Skrill logo (generic payment logo)
      name: 'Skrill',
      date: '5 Apr 2021',
      amount: '+ $20',
      color: '#4CAF50', // Green for positive amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/troy-1296548_1280.png', // Placeholder for Troy logo (generic payment logo)
      name: 'Troy',
      date: '24 May 2021',
      amount: '- $250',
      color: '#F44336', // Red for negative amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/bitpay-1296549_1280.png', // Placeholder for Bitpay logo
      name: 'Bitpay',
      date: '25 May 2021',
      amount: '- $90',
      color: '#F44336', // Red for negative amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/bitcoin-1296550_1280.png', // Placeholder for Bitcoin logo
      name: 'Bit Coin',
      date: '30 Jun 2021',
      amount: '+ $1020',
      color: '#4CAF50', // Green for positive amount
    },
    {
      logo: 'https://cdn.pixabay.com/photo/2016/03/31/18/35/good-card-1296551_1280.png', // Placeholder for Good card logo (generic bank logo)
      name: 'Good card',
      date: '1 Jul 2021',
      amount: '- $96',
      color: '#F44336', // Red for negative amount
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.periodButton}>
          <Text style={styles.periodText}>7 Days <Icon name="arrow-drop-down" size={16} color="#fff" /></Text>
        </TouchableOpacity>
      </View>

      {/* Total Amount */}
      <Text style={styles.totalAmount}>$9230</Text>

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        {transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <Image
              source={{ uri: transaction.logo }}
              style={styles.transactionLogo}
              resizeMode="contain"
            />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>{transaction.name}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: transaction.color }]}>
              {transaction.amount}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="folder" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bar-chart" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="notifications" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#9C27B0', // Purple header
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  periodButton: {
    backgroundColor: '#7B1FA2', // Darker purple for button
    padding: 5,
    borderRadius: 10,
  },
  periodText: {
    fontSize: 14,
    color: '#fff',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  transactionLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#9C27B0', // Purple for bottom nav
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default TransactionsScreen;