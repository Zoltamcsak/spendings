package org.spendings.service.dto;


import java.time.LocalDate;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Spending entity.
 */
public class SpendingDTO implements Serializable {

    private Long id;

    private Long price;

    private LocalDate date;

    private Long itemId;

    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SpendingDTO spendingDTO = (SpendingDTO) o;
        if(spendingDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), spendingDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SpendingDTO{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
