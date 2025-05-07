import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Pressable, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNModal from 'react-native-modal';

import { TextInput } from 'react-native';

const initialCategories = [
  { name: '勉強', color: '#FF6666' },
  { name: '休憩', color: '#66CCFF' },
];

const StopwatchScreen = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedLapIndex, setSelectedLapIndex] = useState(null);
  const intervalRef = useRef(null);

  const [newCategoryName, setNewCategoryName] = useState('');
const [newCategoryColor, setNewCategoryColor] = useState('#999');

const [colorPickerState, setColorPickerState] = useState({
  visible: false, // モーダルの表示状態
  targetIndex: null, // null → 新規カテゴリ / 数値 → 編集対象のカテゴリインデックス
});

// 色選択モーダルを開く関数
const openColorPicker = (index = null) => {
  setColorPickerState({ visible: true, targetIndex: index });
};

// 色選択モーダルを閉じる関数
const closeColorPicker = () => {
  setColorPickerState({ visible: false, targetIndex: null });
};

// 現在選択されている色を取得
const getCurrentSelectedColor = () => {
  if (colorPickerState.targetIndex === null) {
    return newCategoryColor; // 新規カテゴリの色
  }
  return categories[colorPickerState.targetIndex]?.color || '#999'; // 既存カテゴリの色
};

// 色を更新する関数
const handleColorSelect = (color) => {
  if (colorPickerState.targetIndex === null) {
    // 新規カテゴリの色を設定
    setNewCategoryColor(color);
  } else {
    // 既存カテゴリの色を更新
    updateCategoryColor(colorPickerState.targetIndex, color);
  }
  closeColorPicker();
};


const addNewCategory = () => {
  if (!newCategoryName.trim()) return;
  setCategories((prev) => [
    ...prev,
    { name: newCategoryName.trim(), color: newCategoryColor },
  ]);
  setNewCategoryName('');
  setNewCategoryColor('#999');
};

const editCategoryColor = (index) => {

};

const updateCategoryColor = (index, newColor) => {
  setCategories((prev) => {
    const updated = [...prev];
    updated[index].color = newColor;
    return updated;
  });
};


  const start = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
  };

  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleLap = () => {
    setLaps(prev => [{ time, category: null }, ...prev]);
  };

  const openCategoryModal = (index) => {
    setSelectedLapIndex(index);
    setCategoryModalVisible(true);
  };

  const selectCategory = (category) => {
    setLaps(prev => {
      const updated = [...prev];
      updated[selectedLapIndex].category = category;
      return updated;
    });
    setCategoryModalVisible(false);
  };


  return (  //UIを返すHTML
    <View style={styles.container}>
      <Text style={styles.timer}>{time} 秒</Text>

      <View style={styles.buttonRow}>
        <Button title={running ? 'ストップ' : 'スタート'} onPress={running ? stop : start} />
        {running && <Button title="ラップ" onPress={handleLap} />}
      </View>

      <FlatList
        data={laps}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.lapItem}>
            <Text style={styles.lapText}>ラップ {laps.length - index}: {item.time} 秒</Text>
            <Pressable
              style={[styles.categoryButton, { backgroundColor: item.category?.color || '#eee' }]}
              onPress={() => openCategoryModal(index)}
            >
              <Text>{item.category?.name || 'カテゴリ設定'}</Text>
            </Pressable>
          </View>
        )}
      />

      {/* モーダル（カテゴリ選択） */}
      {/* カテゴリ選択モーダル */}
<RNModal
  isVisible={categoryModalVisible}
  onBackdropPress={() => setCategoryModalVisible(false)}
  style={styles.modal}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>カテゴリを選択</Text>

    {/* 既存カテゴリリスト */}
    {categories.map((cat, i) => (
      <View key={i} style={styles.categoryEditRow}>
        <Pressable
          style={[styles.categoryOption, { backgroundColor: cat.color }]}
          onPress={() => selectCategory(cat)}
        >
          <Text style={{ color: '#fff' }}>{cat.name}</Text>
        </Pressable>
        {/* 既存カテゴリの色編集 */}
<Pressable
  style={styles.editColorButton}
  onPress={() => openColorPicker(i)} // 既存カテゴリのインデックス
>
  <Text>🎨</Text>
</Pressable>

      </View>
    ))}

    {/* カテゴリ追加欄 */}
    <View style={styles.addCategory}>
      <Text>＋ 新規カテゴリ追加</Text>
      <View style={styles.addRow}>
        <TextInput
          placeholder="名前"
          style={styles.input}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        {/* 新規カテゴリの色選択 */}
<Pressable
  style={[styles.colorPreview, { backgroundColor: newCategoryColor }]}
  onPress={() => openColorPicker(null)} // 新規カテゴリ
/>
        <Button title="追加" onPress={addNewCategory} />
      </View>


    </View>

    {/* カラーピッカー（新規カテゴリ用 or 編集） */}
  

    <Button title="閉じる" onPress={() => setCategoryModalVisible(false)} />
  </View>
  

</RNModal>
{/* === 色選択モーダル === */}
<RNModal
  isVisible={colorPickerState.visible}
  onBackdropPress={closeColorPicker}
  style={styles.modal}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>色を選択</Text>
    <View style={styles.colorPickerRow}>
      {['#ff6666', '#66ccff', '#99cc33', '#ffcc66', '#99ff99', '#cc99ff', '#ffaaff'].map((color) => (
        <Pressable
          key={color}
          style={[
            styles.colorCircle,
            {
              backgroundColor: color,
              borderWidth: getCurrentSelectedColor() === color ? 3 : 1,
              borderColor: getCurrentSelectedColor() === color ? '#000' : '#ccc',
            },
          ]}
          onPress={() => handleColorSelect(color)}
        />
      ))}
    </View>
    <Button title="キャンセル" onPress={closeColorPicker} />
  </View>
</RNModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 10 },
  timer: { fontSize: 48, textAlign: 'center', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  lapText: { fontSize: 16 },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  categoryOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },

  categoryEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  editColorButton: {
    padding: 4,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  addCategory: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    borderRadius: 6,
    flex: 1,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  colorPickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  colorPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  
  
  
});

export default StopwatchScreen;
