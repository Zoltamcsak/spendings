package org.spendings.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Spending.
 */
@Entity
@Table(name = "spending")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Spending implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price")
    private Long price;

    @Column(name = "jhi_date")
    private LocalDate date;

    @OneToOne
    @JoinColumn(unique = true)
    private Item item;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPrice() {
        return price;
    }

    public Spending price(Long price) {
        this.price = price;
        return this;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public LocalDate getDate() {
        return date;
    }

    public Spending date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Item getItem() {
        return item;
    }

    public Spending item(Item item) {
        this.item = item;
        return this;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public User getUser() {
        return user;
    }

    public Spending user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Spending spending = (Spending) o;
        if (spending.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), spending.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Spending{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
