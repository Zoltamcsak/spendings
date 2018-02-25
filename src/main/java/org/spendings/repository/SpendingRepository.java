package org.spendings.repository;

import org.spendings.domain.Spending;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Spending entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SpendingRepository extends JpaRepository<Spending, Long> {
  List<Spending> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
