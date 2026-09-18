import { useCardTransaction } from "@/hooks/useCardTransaction";
import CustomModal from "../ui/CustomModal";
import CategoryPickerSheet from "./card-transaction/CategoryPickerSheet";
import IconPickerModal from "./card-transaction/IconPickerModal";
import TransactionForm from "./card-transaction/TransactionsForm";

type Props = {
  onSubmit: VoidFunction;
  defaultCategory?: string;
  defaultType?: "income" | "expense";
  defaultIcon?: string;
};

export default function CardTransaction({
  defaultCategory,
  defaultType,
  defaultIcon,
  onSubmit,
}: Props) {
  const {
    isIncome,
    setIsIncome,
    amount,
    handleAmountChange,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryData,
    submitting,
    handleAdd,

    newCategory,
    setNewCategory,
    pickerIcon,
    setPickerIcon,
    handleCreateCategory,

    showIconPicker,
    setShowIconPicker,

    showCategorySheet,
    setShowCategorySheet,
    categorySearch,
    setCategorySearch,
    editMode,
    setEditMode,
    toggleEditMode,
    filteredCategoryItems,

    categoryToDelete,
    setCategoryToDelete,
    handleConfirmDelete,
    blockedDeleteMessage,
    setBlockedDeleteMessage,
    showDeletedModal,
    setShowDeletedModal,

    openModal,
    setOpenModal,
  } = useCardTransaction({ defaultCategory, defaultType, defaultIcon });

  // Al elegir una categoría del sheet, se guarda, se limpia la búsqueda y
  // se cierra el sheet — los 3 pasos que antes vivían inline en el JSX.
  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
    setCategorySearch("");
    setShowCategorySheet(false);
  };

  // Igual con el ícono: se guarda y se cierra el modal.
  const handleSelectIcon = (icon: string) => {
    setPickerIcon(icon);
    setShowIconPicker(false);
  };

  return (
    <>
      <TransactionForm
        isIncome={isIncome}
        onToggleIncome={() => setIsIncome(!isIncome)}
        selectedCategoryData={selectedCategoryData}
        onOpenCategorySheet={() => setShowCategorySheet(true)}
        pickerIcon={pickerIcon}
        onOpenIconPicker={() => setShowIconPicker(true)}
        newCategory={newCategory}
        onChangeNewCategory={setNewCategory}
        onCreateCategory={handleCreateCategory}
        amount={amount}
        onChangeAmount={handleAmountChange}
        submitting={submitting}
        onAdd={handleAdd}
      />

      <CategoryPickerSheet
        visible={showCategorySheet}
        editMode={editMode}
        onToggleEditMode={toggleEditMode}
        onCloseEditMode={() => setEditMode(false)}
        onClose={() => setShowCategorySheet(false)}
        categorySearch={categorySearch}
        onChangeSearch={setCategorySearch}
        filteredCategoryItems={filteredCategoryItems}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onDeleteItem={setCategoryToDelete}
      />

      <IconPickerModal
        visible={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        pickerIcon={pickerIcon}
        onSelectIcon={handleSelectIcon}
      />

      <CustomModal
        visible={openModal}
        title="¡Transacción añadida!"
        message="Tu transacción se registró correctamente."
        confirmText="Aceptar"
        onConfirm={() => {
          setOpenModal(false);
          onSubmit();
        }}
      />
      <CustomModal
        visible={!!categoryToDelete}
        title="¿Eliminar categoría?"
        message={`Vas a eliminar "${categoryToDelete?.label}". Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />

      <CustomModal
        visible={!!blockedDeleteMessage}
        title="No se puede eliminar"
        message={blockedDeleteMessage ?? ""}
        confirmText="Entendido"
        onConfirm={() => setBlockedDeleteMessage(null)}
      />

      <CustomModal
        visible={showDeletedModal}
        title="Categoría eliminada"
        message="La categoría ha sido eliminada."
        confirmText="Aceptar"
        onConfirm={() => setShowDeletedModal(false)}
      />
    </>
  );
}
