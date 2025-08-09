package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.OrderItems;
import hibernate.Orders;
import hibernate.Product;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "LoadItems", urlPatterns = {"/LoadItems"})
public class LoadItems extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        String orderId = request.getParameter("id");

        if (Util.isInteger(orderId)) {
            SessionFactory sf = HibernateUtil.getSessionFactory();
            Session s = sf.openSession();

            try {
                // Fetch the order by ID
                Orders order = (Orders) s.get(Orders.class, Integer.parseInt(orderId));
                if (order == null) {
                    responseObject.addProperty("message", "Order not found");
                } else {
                    // Get all order items for this order ID
                    Criteria c1 = s.createCriteria(OrderItems.class);
                    c1.add(Restrictions.eq("orders.id", Integer.parseInt(orderId)));
                    List<OrderItems> orderItemsList = c1.list();

                    // Clean up sensitive data
                    for (OrderItems item : orderItemsList) {
                        if (item.getProduct() != null) {
                            if (item.getProduct().getUser() != null) {
                                item.getProduct().getUser().setEmail(null);
                                item.getProduct().getUser().setPassword(null);
                                item.getProduct().getUser().setVerification(null);
                                item.getProduct().getUser().setMobile(null);
                                item.getProduct().getUser().setId(-1);
                                item.getProduct().getUser().setCreated_at(null);
                            }
                        }
                    }
                    Object orderStatus = order.getOrderStatus(); // e.g., order.getOrderStatus().getValue() if status is an entity

                    responseObject.add("orderItemsList", gson.toJsonTree(orderItemsList));
                    responseObject.add("orderStatus", gson.toJsonTree(orderStatus));
                    responseObject.addProperty("status", true);
                }

            } catch (Exception e) {
                e.printStackTrace();
                responseObject.addProperty("message", "Error fetching order items");
            } finally {
                s.close();
            }

        } else {
            responseObject.addProperty("message", "Invalid Order ID");
        }

        response.setContentType("application/json");
        String toJson = gson.toJson(responseObject);
        response.getWriter().write(toJson);
    }
}
