
package controller;

import hibernate.Cart;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import hibernate.Wishlist;
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


@WebServlet(name = "CheckSessionWish", urlPatterns = {"/CheckSessionWish"})
public class CheckSessionWish extends HttpServlet {
@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = (User) request.getSession().getAttribute("user");
        if (user != null) {
            ArrayList<Wishlist> sessionWishes = (ArrayList<Wishlist>) request.getSession().getAttribute("sessionWishes");
            if (sessionWishes != null) {
                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();
                Transaction tr = null;

                try {
                    tr = s.beginTransaction(); // Start transaction only once

                    for (Wishlist sessionWish : sessionWishes) {
                        Product product = (Product) s.get(Product.class, sessionWish.getProduct().getId());

                        Criteria c1 = s.createCriteria(Wishlist.class);
                        c1.add(Restrictions.eq("user", user));
                        c1.add(Restrictions.eq("product", sessionWish.getProduct()));

                        Wishlist dbWish = (Wishlist) c1.uniqueResult();

                        if (dbWish == null) {
                            sessionWish.setUser(user);
                            s.save(sessionWish);
                        }
                    }

                    tr.commit(); // Commit once after all operations
                    request.getSession().setAttribute("sessionWishes", null);
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
