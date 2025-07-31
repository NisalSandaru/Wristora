
package controller;

import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author user
 */
@WebServlet(name = "CheckSessionCart", urlPatterns = {"/CheckSessionCart"})
public class CheckSessionCart extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {
            ArrayList<Cart> sessionCarts = (ArrayList<Cart>) request.getSession().getAttribute("sessionCart");
            if (sessionCarts != null) {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                Transaction tr = null;

                try {
                    tr = s.beginTransaction(); // Start transaction only once

                    for (Cart sessionCart : sessionCarts) {
                        Product product = (Product) s.get(Product.class, sessionCart.getProduct().getId());

                        Criteria c1 = s.createCriteria(Cart.class);
                        c1.add(Restrictions.eq("user", user));
                        c1.add(Restrictions.eq("product", sessionCart.getProduct()));

                        Cart dbCart = (Cart) c1.uniqueResult();

                        if (dbCart == null) {
                            sessionCart.setUser(user);
                            s.save(sessionCart);
                        } else {
                            int newQty = sessionCart.getQty() + dbCart.getQty();
                            if (newQty <= product.getQty()) {
                                dbCart.setQty(newQty);
                                s.update(dbCart);
                            }
                        }
                    }

                    tr.commit(); // Commit once after all operations
                    request.getSession().setAttribute("sessionCart", null);
                    response.setStatus(HttpServletResponse.SC_OK);

                } catch (Exception e) {
                    if (tr != null) tr.rollback(); // Rollback on error
                    response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
                    e.printStackTrace();
                } finally {
                    s.close(); // Always close session
                }

            } else {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            }
        } else {
            response.setStatus(1);
        }
    }
}

